import { useReveal } from '../hooks/useReveal';

/**
 * Envoltorio de la entrada escalonada. `delay` es el retardo del escalonado
 * dentro de una misma rejilla.
 */
export default function Reveal({
  as: Tag = 'div',
  delay = 0,
  className = '',
  style,
  children,
  ...rest
}) {
  const rv = useReveal(delay);
  return (
    <Tag
      ref={rv.ref}
      className={className ? `${rv.className} ${className}` : rv.className}
      style={{ ...rv.style, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
