import type { Meta, StoryObj } from '@storybook/react';
import { DemoButton } from './DemoButton';

const meta = {
  title: 'Demo/DemoButton',
  component: DemoButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '这是一个基于 mtxuilib Button 组件的演示组件，展示了不同的按钮样式和状态。',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: '按钮的变体样式',
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg'],
      description: '按钮的尺寸',
    },
    disabled: {
      control: { type: 'boolean' },
      description: '是否禁用按钮',
    },
    children: {
      control: { type: 'text' },
      description: '按钮显示的文本',
    },
  },
  args: { 
    onClick: () => console.log('Button clicked!') 
  },
} satisfies Meta<typeof DemoButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// 默认按钮
export const Default: Story = {
  args: {
    children: '默认按钮',
  },
};

// 主要按钮
export const Primary: Story = {
  args: {
    children: '主要按钮',
    variant: 'default',
  },
};

// 危险按钮
export const Destructive: Story = {
  args: {
    children: '危险按钮',
    variant: 'destructive',
  },
};

// 轮廓按钮
export const Outline: Story = {
  args: {
    children: '轮廓按钮',
    variant: 'outline',
  },
};

// 次要按钮
export const Secondary: Story = {
  args: {
    children: '次要按钮',
    variant: 'secondary',
  },
};

// 幽灵按钮
export const Ghost: Story = {
  args: {
    children: '幽灵按钮',
    variant: 'ghost',
  },
};

// 链接按钮
export const Link: Story = {
  args: {
    children: '链接按钮',
    variant: 'link',
  },
};



// 小尺寸按钮
export const Small: Story = {
  args: {
    children: '小按钮',
    size: 'sm',
  },
};

// 大尺寸按钮
export const Large: Story = {
  args: {
    children: '大按钮',
    size: 'lg',
  },
};

// 禁用状态
export const Disabled: Story = {
  args: {
    children: '禁用按钮',
    disabled: true,
  },
};

// 所有变体展示
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 p-4">
      <DemoButton variant="default">默认</DemoButton>
      <DemoButton variant="destructive">危险</DemoButton>
      <DemoButton variant="outline">轮廓</DemoButton>
      <DemoButton variant="secondary">次要</DemoButton>
      <DemoButton variant="ghost">幽灵</DemoButton>
      <DemoButton variant="link">链接</DemoButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示所有按钮变体的组合效果',
      },
    },
  },
};

// 所有尺寸展示
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4">
      <DemoButton size="sm">小</DemoButton>
      <DemoButton size="default">默认</DemoButton>
      <DemoButton size="lg">大</DemoButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: '展示所有按钮尺寸的对比效果',
      },
    },
  },
};
