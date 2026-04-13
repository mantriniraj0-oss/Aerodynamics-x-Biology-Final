When using Tailwind CSS
- Do not use the `group` utility with `@apply`. 
  - Incorrect: `@apply ... group;`
  - Correct: Add `group` directly to the HTML/JSX `className`.