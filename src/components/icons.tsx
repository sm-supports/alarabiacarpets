/**
 * Icons from the shared sprite public/icons.svg (scripts/build-icons.mjs), with the
 * same names and props as lucide-react. A new icon needs adding to that script too.
 */
interface IconProps {
  size?: number;
  className?: string;
}

function sprite(id: string) {
  return function Icon({ size = 24, className }: IconProps) {
    return (
      <svg width={size} height={size} className={className} aria-hidden="true">
        <use href={`/icons.svg#${id}`} />
      </svg>
    );
  };
}

export const ArrowLeft = sprite("arrow-left");
export const ArrowRight = sprite("arrow-right");
export const ArrowUpRight = sprite("arrow-up-right");
export const Check = sprite("check");
export const ChevronLeft = sprite("chevron-left");
export const ChevronRight = sprite("chevron-right");
export const ExternalLink = sprite("external-link");
export const Facebook = sprite("facebook");
export const Headphones = sprite("headphones");
export const ImageIcon = sprite("image");
export const Instagram = sprite("instagram");
export const Mail = sprite("mail");
export const MapPin = sprite("map-pin");
export const MessageCircle = sprite("message-circle");
export const Pause = sprite("pause");
export const Phone = sprite("phone");
export const Play = sprite("play");
export const Shield = sprite("shield");
export const ShoppingCart = sprite("shopping-cart");
export const Truck = sprite("truck");
export const Video = sprite("video");
export const Wrench = sprite("wrench");
export const X = sprite("x");

/**
 * The same X, drawn inline for StatePanel's Close. That panel is what a visitor sees when
 * the network has gone, and a sprite icon first used offline can come out blank, which
 * would leave Close an empty button.
 */
export function XInline({ className }: Pick<IconProps, "className">) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
