import { redirect } from "next/navigation";

/**
 * L’espace particulier est désactivé pour le moment : les demandes se déposent
 * sans compte depuis /deposer, et les coordonnées sont transmises aux
 * réparateurs. On redirige donc toute ancienne URL vers l’accueil.
 */
export default function MesDemandesPage() {
  redirect("/");
}
