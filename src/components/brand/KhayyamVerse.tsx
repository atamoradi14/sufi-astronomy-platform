"use client";
import { useLanguage } from "@/components/language/Language";

/** Our English rendering; Persian text follows Hedayat's selection on Ganjoor. */
export function KhayyamVerse({ full = false }: { full?: boolean }) {
  const { t } = useLanguage();
  return (
    <figure className="brand-verse">
      <blockquote>
        <p>
          {t(
            "این چرخِ فلک که ما در او حیرانیم",
            "This wheel of heaven leaves us wondering;",
          )}
        </p>
        <p>
          {t(
            "فانوس خیال از او مثالی دانیم",
            "we see its likeness in a lantern of imagination.",
          )}
        </p>
        {full && (
          <>
            <p>
              {t(
                "خورشیدْ چراغدان و عالَم فانوس",
                "The sun is the lamp, the world its lantern;",
              )}
            </p>
            <p>
              {t(
                "ما چون صُوَریم کاندر او گَردانیم",
                "we are like figures turning within it.",
              )}
            </p>
          </>
        )}
      </blockquote>
      <figcaption>
        <a
          href="https://ganjoor.net/khayyam/tarane/tkh7/sh5"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("از رباعی منسوب به خیام", "From a quatrain attributed to Khayyam")}
        </a>
      </figcaption>
    </figure>
  );
}
