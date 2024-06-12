import ItemTypes from "@/components/itemTypes/itemTypes";
import Organizations from "@/components/organizations/organizations";
import Tables from "@/components/tables/tables";

export default async function SettingsPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <Organizations />
      <ItemTypes />
      <Tables />
    </section>
  );
}
