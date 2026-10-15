import base64
import hashlib
import importlib.util
import json
import tempfile
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('ci_server', Path(__file__).resolve().parents[1] / 'scripts/ci-deploy-server.py')
server = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server)


class DeploymentTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name).resolve()
        self.root = self.base / 'htdocs'
        self.root.mkdir()
        self.original = {'index.html': b'original homepage', 'js/flight.js': b'original flight',
                         'js/retired.js': b'retired', '.htaccess': b'DirectoryIndex index.html index.php\n',
                         'robots.txt': b'User-agent: *\nDisallow: /new/\n'}
        for name, content in self.original.items():
            self.write(name, content)
        self.engine = server.Deployment(self.root, self.base / 'state.json', self.base / 'backups', 'production')
        self.before = {'files': self.manifest(self.original), 'revision': 'a' * 40, 'release': 'initial'}
        self.engine.write_json(self.engine.state, self.before)

    def write(self, name, content):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(content)

    @staticmethod
    def manifest(contents):
        return {name: hashlib.sha256(value).hexdigest() for name, value in contents.items()}

    def request(self, contents):
        files = self.manifest(contents)
        current = self.engine.inspect({'files': files})
        return {'files': files, 'baseline': current['hashes'], 'state': current['state'],
                'changes': {name: base64.b64encode(value).decode() for name, value in contents.items()
                            if current['hashes'].get(name) != files[name]},
                'revision': 'b' * 40, 'release': 'test-release'}

    def updated(self):
        contents = dict(self.original)
        contents['index.html'] = b'new homepage'
        contents['js/flight.js'] = b'new flight'
        contents['js/extra.js'] = b'new module'
        del contents['js/retired.js']
        return contents

    def test_delta_preserves_legacy_and_staging_and_rollback_restores_old_files(self):
        self.write('dwa/index.php', b'legacy')
        self.write('new/index.html', b'staging')
        result = self.engine.apply(self.request(self.updated()))
        self.assertEqual(result['changed'], 3)
        self.assertEqual(result['removed'], 1)
        self.assertEqual((self.root / 'dwa/index.php').read_bytes(), b'legacy')
        self.assertEqual((self.root / 'new/index.html').read_bytes(), b'staging')
        self.assertFalse((self.root / 'js/retired.js').exists())
        self.engine.rollback({'release': result['release']})
        for name, content in self.original.items():
            self.assertEqual((self.root / name).read_bytes(), content)
        self.assertFalse((self.root / 'js/extra.js').exists())
        self.assertEqual(self.engine.current(), self.before)

    def test_no_changes_uploads_nothing_and_does_not_make_a_backup(self):
        request = self.request(self.original)
        self.assertEqual(request['changes'], {})
        self.assertEqual(self.engine.apply(request), {'release': None, 'changed': 0, 'removed': 0})
        self.assertFalse(self.engine.backups.exists())

    def test_verification_failure_rolls_back_automatically(self):
        request = self.request(self.updated())
        def fail(_files): raise RuntimeError('simulated verification failure')
        self.engine.verify = fail
        with self.assertRaisesRegex(RuntimeError, 'simulated'):
            self.engine.apply(request)
        self.assertEqual(self.engine.current(), self.before)
        for name, content in self.original.items(): self.assertEqual((self.root / name).read_bytes(), content)
        self.assertFalse((self.root / 'js/extra.js').exists())

    def test_corrupt_payload_cannot_change_live_files(self):
        request = self.request(self.updated())
        request['changes']['index.html'] = base64.b64encode(b'corrupt').decode()
        with self.assertRaisesRegex(AssertionError, 'Corrupted'):
            self.engine.apply(request)
        self.assertEqual((self.root / 'index.html').read_bytes(), self.original['index.html'])

    def test_paths_cannot_escape_or_touch_staging_from_production(self):
        for name in ['../escape', '/absolute', 'js/../../escape', 'new/index.html', 'backup/a', '.ssh/authorized_keys']:
            with self.subTest(name=name), self.assertRaises(AssertionError):
                self.engine.target(name)

    def test_symlinked_parents_are_rejected(self):
        outside = self.base / 'outside'
        outside.mkdir()
        (self.root / 'linked').symlink_to(outside, target_is_directory=True)
        with self.assertRaises(AssertionError): self.engine.target('linked/escape')

    def test_server_change_between_inspect_and_apply_is_rejected(self):
        request = self.request(self.updated())
        self.write('index.html', b'changed elsewhere')
        with self.assertRaisesRegex(AssertionError, 'Server files changed'):
            self.engine.apply(request)
        self.assertEqual((self.root / 'index.html').read_bytes(), b'changed elsewhere')

    def test_newer_deployment_state_prevents_stale_apply_and_rollback(self):
        request = self.request(self.updated())
        self.engine.write_json(self.engine.state, dict(self.before, release='newer'))
        with self.assertRaisesRegex(AssertionError, 'state changed'): self.engine.apply(request)
        with self.assertRaisesRegex(AssertionError, 'newer deployment'): self.engine.rollback({'release': 'initial'})

    def test_production_requires_legacy_php_fallback(self):
        contents = self.updated()
        contents['.htaccess'] = b'DirectoryIndex index.html\n'
        with self.assertRaises(AssertionError): self.engine.apply(self.request(contents))
        self.assertEqual((self.root / 'index.html').read_bytes(), self.original['index.html'])

    def test_production_rejects_noindex_settings(self):
        contents = self.updated()
        contents['.htaccess'] += b'Header set X-Robots-Tag "noindex"\n'
        with self.assertRaises(AssertionError): self.engine.apply(self.request(contents))

    def test_staging_requires_noindex(self):
        self.engine.environment = 'staging'
        with self.assertRaises(AssertionError): self.engine.apply(self.request(self.updated()))


if __name__ == '__main__':
    unittest.main()
