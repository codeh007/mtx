import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DemoButton } from '../DemoButton';

describe('DemoButton', () => {
  it('renders with default props', () => {
    render(<DemoButton>Test Button</DemoButton>);
    
    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-500', 'text-white');
  });

  it('renders with different variants', () => {
    const { rerender } = render(<DemoButton variant="destructive">Destructive</DemoButton>);
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-500');

    rerender(<DemoButton variant="outline">Outline</DemoButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('border', 'border-gray-300');

    rerender(<DemoButton variant="secondary">Secondary</DemoButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-200');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<DemoButton size="sm">Small</DemoButton>);
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<DemoButton size="lg">Large</DemoButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('handles disabled state', () => {
    render(<DemoButton disabled>Disabled Button</DemoButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<DemoButton onClick={handleClick}>Clickable</DemoButton>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<DemoButton onClick={handleClick} disabled>Disabled</DemoButton>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<DemoButton className="custom-class">Custom</DemoButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('renders link variant with underline', () => {
    render(<DemoButton variant="link">Link Button</DemoButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('underline', 'text-blue-500');
  });

  it('renders ghost variant with transparent background', () => {
    render(<DemoButton variant="ghost">Ghost Button</DemoButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
  });
});
