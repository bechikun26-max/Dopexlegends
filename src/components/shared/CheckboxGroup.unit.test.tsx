import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CheckboxGroup } from './CheckboxGroup';

describe('CheckboxGroup', () => {
  const items = [
    { id: 'item-1', name: 'Item 1', imagePath: '/images/item1.png' },
    { id: 'item-2', name: 'Item 2', imagePath: '/images/item2.png' },
    { id: 'item-3', name: 'Item 3' },
  ];

  it('renders all items with checkboxes', () => {
    const checks = new Map([
      ['item-1', true],
      ['item-2', false],
      ['item-3', true],
    ]);
    const onChange = vi.fn();

    render(<CheckboxGroup items={items} checks={checks} onChange={onChange} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();
    expect(checkboxes[2]).toBeChecked();
  });

  it('renders item names', () => {
    const checks = new Map<string, boolean>();
    const onChange = vi.fn();

    render(<CheckboxGroup items={items} checks={checks} onChange={onChange} />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });

  it('renders images for items that have imagePath', () => {
    const checks = new Map<string, boolean>();
    const onChange = vi.fn();

    render(<CheckboxGroup items={items} checks={checks} onChange={onChange} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', '/images/item1.png');
    expect(images[0]).toHaveAttribute('alt', 'Item 1');
    expect(images[1]).toHaveAttribute('src', '/images/item2.png');
    expect(images[1]).toHaveAttribute('alt', 'Item 2');
  });

  it('calls onChange with the item id when a checkbox is clicked', () => {
    const checks = new Map([
      ['item-1', true],
      ['item-2', false],
      ['item-3', true],
    ]);
    const onChange = vi.fn();

    render(<CheckboxGroup items={items} checks={checks} onChange={onChange} />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('item-2');
  });

  it('renders group label when provided', () => {
    const checks = new Map<string, boolean>();
    const onChange = vi.fn();

    render(
      <CheckboxGroup
        items={items}
        checks={checks}
        onChange={onChange}
        groupLabel="Test Group"
      />
    );

    expect(screen.getByText('Test Group')).toBeInTheDocument();
  });

  it('does not render group label when not provided', () => {
    const checks = new Map<string, boolean>();
    const onChange = vi.fn();

    render(<CheckboxGroup items={items} checks={checks} onChange={onChange} />);

    expect(screen.queryByText('Test Group')).not.toBeInTheDocument();
  });

  it('defaults to unchecked when id is not in checks map', () => {
    const checks = new Map<string, boolean>();
    const onChange = vi.fn();

    render(<CheckboxGroup items={items} checks={checks} onChange={onChange} />);

    const checkboxes = screen.getAllByRole('checkbox');
    checkboxes.forEach((cb) => {
      expect(cb).not.toBeChecked();
    });
  });

  it('has accessible group role with aria-label', () => {
    const checks = new Map<string, boolean>();
    const onChange = vi.fn();

    render(
      <CheckboxGroup
        items={items}
        checks={checks}
        onChange={onChange}
        groupLabel="Accessible Group"
      />
    );

    expect(screen.getByRole('group', { name: 'Accessible Group' })).toBeInTheDocument();
  });
});
