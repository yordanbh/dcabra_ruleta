export default function SideBanner({ src, alt, side }) {
  return (
    <aside className="hidden w-full max-w-[200px] flex-col items-center justify-start pt-8 xl:flex 2xl:max-w-[470px]">
      <div className="sticky top-8 w-full overflow-hidden rounded-2xl border border-dcabra-border bg-white shadow-sm">
        <img
          src={src}
          alt={alt}
          className="h-auto w-full object-cover"
          onError={(event) => {
            event.currentTarget.hidden = true;
            event.currentTarget.nextElementSibling.hidden = false;
          }}
        />
        <div hidden className="flex h-[500px] items-center justify-center bg-dcabra-primaryFaded p-6 text-center">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-dcabra-muted">Espacio</p>
            <p className="mt-1 text-sm font-bold text-dcabra-primary">Promocional</p>
            <p className="mt-3 text-[10px] text-dcabra-muted/70">banner-{side}.jpg</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
