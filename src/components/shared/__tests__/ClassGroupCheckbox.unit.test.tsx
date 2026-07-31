import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ClassGroupCheckbox } from '../ClassGroupCheckbox';

describe('ClassGroupCheckbox', () => {
  const memberIds = ['bangalore', 'revenant', 'fuse', 'mad-maggie', 'ballistic'];
  const groupName = 'Assault';

  it('displays group name and count', () => {
    const checks = new Map(memberIds.map(id => [id, true]));
    render(
      <ClassGroupCheckbox
        groupName={groupName}
        memberIds={memberIds}
        checks={checks}
        onToggleGroup={() => {}}
      />
    );

    expect(screen.getByText('Assault')).toBeInTheDocument();
    expect(screen.getByText('(5/5)')).toBeInTheDocument();
  });

  it('shows checked state when all members are checked', () => {
    const checks = new Map(memberIds.map(id => [id, true]));
    render(
      <ClassGroupCheckbox
        groupName={groupName}
        memberIds={memberIds}
        checks={checks}
        onToggleGroup={() => {}}
      />
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
    expect(checkbox.indeterminate).toBe(false);
  });

  it('shows unchecked state when no members are checked', () => {
    const checks = new Map(memberIds.map(id => [id, false]));
    render(
      <ClassGroupCheckbox
        groupName={groupName}
        memberIds={memberIds}
        checks={checks}
        onToggleGroup={() => {}}
      />
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    expect(checkbox.indeterminate).toBe(false);
  });

  it('shows indeterminate state when some members are checked', () => {
    const checks = new Map([
      ['bangalore', true],
      ['revenant', true],
      ['fuse', false],
      ['mad-maggie', false],
      ['ballistic', false],
    ]);
    render(
      <ClassGroupCheckbox
        groupName={groupName}
        memberIds={memberIds}
        checks={checks}
        onToggleGroup={() => {}}
      />
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    expect(checkbox.indeterminate).toBe(true);
    expect(screen.getByText('(2/5)')).toBeInTheDocument();
  });

  it('calls onToggleGroup when checkbox is clicked', () => {
    const onToggleGroup = vi.fn();
    const checks = new Map(memberIds.map(id => [id, true]));
    render(
      <ClassGroupCheckbox
        groupName={groupName}
        memberIds={memberIds}
        checks={checks}
        onToggleGroup={onToggleGroup}
      />
    );

    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggleGroup).toHaveBeenCalledTimes(1);
  });

  it('handles empty memberIds gracefully', () => {
    const checks = new Map<string, boolean>();
    render(
      <ClassGroupCheckbox
        groupName="Empty"
        memberIds={[]}
        checks={checks}
        onToggleGroup={() => {}}
      />
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    // With 0 members: checkedCount=0, length=0, allChecked = (0===0) = true
    expect(checkbox.checked).toBe(true);
    expect(screen.getByText('(0/0)')).toBeInTheDocument();
  });

  it('treats missing keys in checks map as unchecked', () => {
    // Only some members exist in the map
    const checks = new Map([
      ['bangalore', true],
    ]);
    render(
      <ClassGroupCheckbox
        groupName={groupName}
        memberIds={memberIds}
        checks={checks}
        onToggleGroup={() => {}}
      />
    );

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    expect(checkbox.indeterminate).toBe(true);
    expect(screen.getByText('(1/5)')).toBeInTheDocument();
  });
});
