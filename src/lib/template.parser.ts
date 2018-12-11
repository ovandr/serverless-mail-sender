import { render } from 'mustache';

export default function renderTemplate(template: string, data: {}): string {
    return render(template, data);
}
