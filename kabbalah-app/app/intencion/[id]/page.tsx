import Link from "next/link";
import { intenciones, meditacion } from "../../data/content";

export default function IntencionPage({ params }: { params: { id: string } }) {
    const intencion = intenciones.find((i) => i.id === params.id);

    if (!intencion) {
        return (
            <main className="min-h-screen bg-gradient-to-b from-background-deep to-background-soft flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😔</div>
                    <h1 className="text-2xl font-bold mb-4">Intención no encontrada</h1>
                    <Link href="/" className="text-accent-gold hover:text-accent-silver">
                        ← Volver al inicio
                    </Link>
                </div>
            </main>
        );
    }

    // Filtrar contenido relacionado
    const contenidoRelacionado = meditacion.intenciones.includes(intencion.id)
        ? [meditacion]
        : [];

    return (
        <main className="min-h-screen bg-gradient-to-b from-background-deep to-background-soft">
            {/* Header */}
            <header className="bg-background-surface/30 backdrop-blur-sm border-b border-accent-gold/20 py-4 px-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <Link href="/" className="text-accent-gold hover:text-accent-silver">
                        ← Inicio
                    </Link>
                    <div className="text-sm text-gray-400">/ {intencion.nombre}</div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Título */}
                <div className="text-center mb-12">
                    <div
                        className="text-7xl mb-4"
                        style={{ filter: `drop-shadow(0 0 15px ${intencion.color})` }}
                    >
                        {intencion.icono}
                    </div>
                    <h1
                        className="text-4xl font-bold mb-3"
                        style={{ color: intencion.color }}
                    >
                        {intencion.nombre}
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        {intencion.descripcion}
                    </p>
                </div>

                {/* Contenido Relacionado */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 text-sefirot-tiferet">
                        Contenido para esta Intención
                    </h2>

                    {contenidoRelacionado.length > 0 ? (
                        <div className="space-y-4">
                            {contenidoRelacionado.map((contenido, idx) => (
                                <Link
                                    key={idx}
                                    href="/meditacion"
                                    className="card-mystical p-6 block hover:scale-105 transition-transform"
                                    style={{ borderColor: `${intencion.color}40` }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="text-4xl">🧘</div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold mb-2 text-sefirot-keter">
                                                {contenido.titulo}
                                            </h3>
                                            <p className="text-gray-400 mb-3">{contenido.descripcion}</p>
                                            <div className="flex gap-4 text-sm text-gray-500">
                                                <span>⏱️ {contenido.duracion}</span>
                                                <span>•</span>
                                                <span>📹 Video guía</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="card-mystical p-12 text-center">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-xl font-bold mb-2 text-gray-400">
                                Contenido en Desarrollo
                            </h3>
                            <p className="text-gray-500">
                                Estamos procesando más contenido para esta intención. <br />
                                Próximamente: meditaciones, oraciones y enseñanzas específicas.
                            </p>
                        </div>
                    )}
                </div>

                {/* Otras Intenciones */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 text-sefirot-tiferet">
                        Explorar Otras Intenciones
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {intenciones
                            .filter((i) => i.id !== params.id)
                            .map((otraIntencion) => (
                                <Link
                                    key={otraIntencion.id}
                                    href={`/intencion/${otraIntencion.id}`}
                                    className="card-mystical p-4 hover:scale-105 transition-transform"
                                    style={{ borderColor: `${otraIntencion.color}40` }}
                                >
                                    <div
                                        className="text-3xl mb-2"
                                        style={{ filter: `drop-shadow(0 0 8px ${otraIntencion.color})` }}
                                    >
                                        {otraIntencion.icono}
                                    </div>
                                    <h3
                                        className="font-bold text-sm"
                                        style={{ color: otraIntencion.color }}
                                    >
                                        {otraIntencion.nombre}
                                    </h3>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
