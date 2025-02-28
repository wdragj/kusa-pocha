export default function GuideLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="flex flex-col items-center justify-center gap-4 md:py-10 bg-blue">
            <div className="inline-block justify-center w-full">{children}</div>
        </section>
    );
}
