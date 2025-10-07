// app/steamph1/[id]/page.tsx
import SteamPage from './SteamPage';

export default function Page({ params }: { params: { id: string } }) {
  // Pass the numeric id down; your API expects numbers not strings
  return <SteamPage id={params.id} />;
}