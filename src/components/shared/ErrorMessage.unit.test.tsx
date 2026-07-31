import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ErrorMessage } from './ErrorMessage';

describe('ErrorMessage', () => {
  it('renders error message when message is provided and visible', () => {
    render(<ErrorMessage message="エラーが発生しました" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
  });

  it('renders nothing when message is null', () => {
    const { container } = render(<ErrorMessage message={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when visible is false', () => {
    const { container } = render(
      <ErrorMessage message="エラー" visible={false} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when message is null and visible is false', () => {
    const { container } = render(
      <ErrorMessage message={null} visible={false} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders with role="alert" for accessibility', () => {
    render(<ErrorMessage message="最低1人のレジェンドを選択してください" />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('displays warning icon', () => {
    render(<ErrorMessage message="エラー" />);
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });
});
