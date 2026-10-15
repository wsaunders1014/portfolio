export type Audience = {
  cart: readonly string[];
  campaign: string;
  assignment: 'control' | 'treatment' | 'off';
};
export type Rule =
  | { kind: 'cart'; skus: readonly string[]; match: 'any' | 'all'; present: boolean }
  | { kind: 'campaign'; key: string; value: string; operator: 'equals' | 'exists' | 'notEquals' }
  | { kind: 'experiment'; variant: 'control' | 'treatment'; includeUnassigned: boolean };
export type Decision = { matches: boolean; reason: string; error?: string };

// Pure evaluation: UI, CMS adapters, and tracking are separate concerns.
export function evaluateRule(rule: Rule, audience: Audience): Decision {
  switch (rule.kind) {
    case 'cart': {
      const skus = [...new Set(rule.skus.map(sku => sku.trim()).filter(Boolean))];
      if (!skus.length) return { matches: false, reason: 'Choose at least one product to define this rule.' };
      const count = skus.filter(sku => audience.cart.includes(sku)).length;
      const qualifies = rule.match === 'all' ? count === skus.length : count > 0;
      return { matches: rule.present ? qualifies : !qualifies,
        reason: `${count} of ${skus.length} selected products in the cart. Rule: ${rule.present ? 'include' : 'exclude'} when ${rule.match} match.` };
    }
    case 'campaign': {
      const key = rule.key.trim();
      if (!key) return { matches: false, reason: 'A parameter name is required.', error: 'Enter a parameter name.' };
      try {
        const input = audience.campaign.trim();
        const params = input.startsWith('?') ? new URLSearchParams(input) : new URL(input).searchParams;
        const values = params.getAll(key);
        const exists = params.has(key);
        const equals = values.includes(rule.value);
        const matches = rule.operator === 'exists' ? exists : rule.operator === 'equals' ? equals : exists && !equals;
        return { matches, reason: exists ? `${key} = ${values.map(value => value || '(empty)').join(', ')}. Values are matched literally.` : `${key} is absent. A missing parameter does not match.` };
      } catch {
        return { matches: false, reason: 'The campaign address is invalid.', error: 'Enter a full URL or a query starting with ?.' };
      }
    }
    case 'experiment': {
      const unassigned = audience.assignment === 'off';
      return { matches: unassigned ? rule.includeUnassigned : audience.assignment === rule.variant,
        reason: unassigned ? `Visitor is unassigned. Fallback is ${rule.includeUnassigned ? 'enabled' : 'disabled'}.` : `Visitor is assigned ${audience.assignment}; content targets ${rule.variant}.` };
    }
  }
}
