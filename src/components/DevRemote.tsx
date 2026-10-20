import { router } from 'expo-router';
import { useEffect } from 'react';

/**
 * Télécommande de test, uniquement en développement : l'app lit http://localhost:8099/nav.json
 * ({ "id": "1", "href": "/stats" }) et ouvre la page demandée quand l'id change.
 * Sert à vérifier chaque écran dans le simulateur sans toucher l'écran. Absent de la version publiée.
 */
export function DevRemote() {
  useEffect(() => {
    if (!__DEV__) return;
    let last: string | undefined;
    const timer = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:8099/nav.json?t=${Date.now()}`);
        const cmd = (await res.json()) as { id: string; href?: string; back?: boolean };
        if (cmd.id === last) return;
        const first = last === undefined;
        last = cmd.id;
        if (first) return;
        if (cmd.back) router.back();
        else if (cmd.href) router.navigate(cmd.href as never);
      } catch {
        // Pas de télécommande lancée : rien à faire.
      }
    }, 800);
    return () => clearInterval(timer);
  }, []);
  return null;
}
