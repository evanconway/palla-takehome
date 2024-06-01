export default async function Home({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      hello world
    </main>
  );
}
