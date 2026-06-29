const WHATSAPP_NUMBER = "26664313677";
const INSTAGRAM_URL = "https://www.instagram.com/pastelerialanonaluisa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==";
const MAP_EMBED = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d418.0130319679155!2d-65.62110396302477!3d-33.05372198581012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95d3930bef4ba24f%3A0xc0f50d0838ecc280!2sPasteleria%20La%20Nona%20Luisa!5e0!3m2!1ses!2sar!4v1782768264380!5m2!1ses!2sar";

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--primary-light)]/30 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Columna 1 - Marca */}
          <div>
            <h3 className="text-lg font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] mb-3">
              Pastelería la Nona Luisa
            </h3>
            <p className="text-sm text-[var(--accent)] leading-relaxed">
              Delicias artesanales hechas con amor. Panadería y pastelería de calidad desde el corazón de San Luis.
            </p>
          </div>

          {/* Columna 2 - Contacto */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
              Contacto
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-[var(--accent)]">
              <li>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=Pasteleria+La+Nona+Luisa`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[var(--primary)] transition-colors"
                >
                  <LocationIcon />
                  <span>Hipólito Yrigoyen esq. San Martín, San Luis</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-[var(--primary)] transition-colors"
                >
                  <WhatsAppIcon />
                  <span>{WHATSAPP_NUMBER}</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <ClockIcon />
                <span>Lun a Sáb — 9 a 12hs y 17 a 21hs</span>
              </li>
            </ul>
            <div className="mt-4 rounded-xl overflow-hidden border border-[var(--primary-light)]/30">
              <iframe
                src={MAP_EMBED}
                width="100%"
                height="180"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Ubicación Pastelería la Nona Luisa"
                className="w-full"
              />
            </div>
          </div>

          {/* Columna 3 - Redes */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wider mb-4">
              Seguinos
            </h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[var(--accent)] hover:text-[var(--primary)] transition-colors"
                >
                  <InstagramIcon />
                  <span>@pastelerialanonaluisa</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/338445272976451?ref=NONE_xav_ig_profile_page_web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[var(--accent)] hover:text-[var(--primary)] transition-colors"
                >
                  <FacebookIcon />
                  <span>Pasteleria la Nona Luisa</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--primary-light)]/30">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[var(--accent)]">
            © {new Date().getFullYear()} Pastelería la Nona Luisa - Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
