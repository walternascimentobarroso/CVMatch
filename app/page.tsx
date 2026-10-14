import { AnalysisPanel } from "@/components/analysis-panel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex flex-1 items-start justify-center p-4 sm:p-6">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>CVMatch</CardTitle>
          <CardDescription>
            Compara o teu CV com a descrição de uma vaga e mostra o quão
            compatíveis são.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalysisPanel />
        </CardContent>
      </Card>
    </main>
  );
}
