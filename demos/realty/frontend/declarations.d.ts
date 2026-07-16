declare module "*.css" {
  const styles: { [className: string]: string };
  export = styles;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.jpeg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.svg" {
  const content: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default content;
}
