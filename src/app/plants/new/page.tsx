import Link from "next/link";
import { NewPlantForm } from "@/components/NewPlantForm";

export default function NewPlantPage() {
  return (
    <section className="mx-auto max-w-xl">
      <nav aria-label="Navegacao">
        <Link href="/" className="text-sm text-muted hover:underline">
          ← Voltar
        </Link>
      </nav>
      <h1 className="mt-2 mb-6 text-2xl font-bold">Nova planta</h1>
      <NewPlantForm />
    </section>
  );
}
