import { CvBlock } from "@/components/cv-block";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>CVMatch</CardTitle>
          <CardDescription>
            Compara o teu CV com a descrição de uma vaga e mostra o quão
            compatíveis são.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CvBlock />
        </CardContent>
      </Card>
    </main>
  );
}
