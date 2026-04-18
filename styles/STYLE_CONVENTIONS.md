# CSS Style Conventions

This project keeps a modular stylesheet architecture in [style.css](../style.css) and [styles/modules](./modules).

## Prefixes by Domain

Use these prefixes for new classes:

1. `landing-`: landing page blocks and elements.
2. `shop-`: shop layout and listing sections.
3. `product-`: product card and detail components.
4. `social-`: social feed structures and actions.
5. `messages-`: message workspace containers and sections.
6. `thread-`: conversation list items and metadata.
7. `auth-`: authentication screens and controls.
8. `settings-`: settings page cards and controls.
9. `search-`: global search overlay and results.
10. `chatbot-`: AI assistant widget.
11. `window-`: landing floating window UI.
12. `app-`: app-level shared overlays/toasts.

## State Prefixes

Use explicit state prefixes:

1. `is-` for visual/component state (`is-active`, `is-open`).
2. `has-` for parent capability/content (`has-error`, `has-unread`).

## Utility and Exceptions

1. Avoid adding new unprefixed generic classes.
2. Keep legacy selectors as-is unless a refactor requires renaming.
3. If migrating old classes, add the new prefixed class first and remove old references in a second pass.

## Practical Examples

1. `auth-submit-btn`
2. `messages-threads-panel`
3. `search-result-item`
4. `settings-return-btn`
5. `chatbot-floating-bubble`
