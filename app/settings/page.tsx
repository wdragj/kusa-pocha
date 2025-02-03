import ItemTypes from "@/components/settings/itemTypes/itemTypes";
import Organizations from "@/components/settings/organizations/organizations";
import Tables from "@/components/settings/tables/tables";

export default async function SettingsPage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4">
      <Organizations />
      <ItemTypes />
      <Tables />
    </section>
  );
}
