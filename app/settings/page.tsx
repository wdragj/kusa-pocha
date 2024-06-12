import ItemTypes from "@/components/pochaHome/itemTypes/itemTypes";
import Organizations from "@/components/pochaHome/organizations/organizations";

export default async function SettingsPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <Organizations />
      <ItemTypes />
    </section>
  );
}
