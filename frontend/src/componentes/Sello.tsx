type SelloProps = {
  texto: string;
  clase?: string;
};

export function Sello({ texto, clase = "" }: SelloProps) {
  return <span className={`sello ${clase}`.trim()}>{texto}</span>;
}
