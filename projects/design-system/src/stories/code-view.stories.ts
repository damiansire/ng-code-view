import type { Meta, StoryObj } from '@storybook/angular';
import { CodeViewComponent } from '../lib/components/code-view/code-view.component';
import { CodeLine } from '../lib/components/code-view/libs/code-view.interface';
import { signal } from '@angular/core';

// More on how to set up stories at: https://storybook.js.org/docs/angular/writing-stories/introduction
const meta: Meta<CodeViewComponent> = {
  title: 'CodeView',
  component: CodeViewComponent,
  tags: ['autodocs'],
  render: (args) => ({
    props: {
      ...args,
      htmlCode: signal(args.htmlCode), // Wrap htmlCode in a signal
    },
  }),
};

export default meta;
type Story = StoryObj<CodeViewComponent>;

const code = `
<div class="container">
  <h1>Hello World</h1>
  <p>This is a paragraph of text.</p>
</div>
`;

const code2 = `
<div class="container">
  <h1>Hello World</h1>
  <p>This is a paragraph of text.</p>
  <button (click)="onClick()">Click me</button>
</div>
`;

// More on writing stories with args: https://storybook.js.org/docs/angular/writing-stories/args
export const Primary: Story = {
  args: {
    textSize: 'text-2xl',
    selectBy: 'Element',
  },
};

export const SelectByLine: Story = {
  args: {
    htmlCode: code,
    textSize: 'text-2xl',
    selectBy: 'Line',
  },
};

export const SelectByElement: Story = {
  args: {
    htmlCode: code2,
    textSize: 'text-2xl',
    selectBy: 'Element',
  },
};
