# UI Selector Contracts: stable testing anchors

To prevent fragile tests, we use a naming convention for `data-testid` attributes on stable UI elements.

## Application Lifecycle
- `card-application-[id]`: Container for a specific application.
- `btn-submit-app`: Primary submission button.
- `status-badge`: Application status indicator.
- `file-upload-input`: Dropzone for documents.

## Navigation
- `nav-link-dashboard`: Link to user dashboard.
* `nav-link-services`: Link to services portal.
* `lang-switcher`: Button to toggle AR/EN.
* `theme-switcher`: Button to toggle Dark/Light.

## Wizard Steps
- `wizard-step-[1-10]`: Container for wizard steps.
- `btn-wizard-next`: Continue to next step.
- `btn-wizard-prev`: Go back to previous step.

## Performance Hooks
- `perf-mark-fcp`: Element that signals meaningful content paint (for benchmarking).
