export default function MenuLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="flex flex-col items-center justify-center gap-4 md:py-10 bg-blue">
            <div className="inline-block text-center justify-center w-full">{children}</div>
        </section>
    );
}
