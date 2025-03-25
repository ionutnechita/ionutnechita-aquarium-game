"use client";

import React from 'react';
import { FishTank } from './components/game/FishTank';
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Acvariu Interactiv</CardTitle>
          <CardDescription>Un joc simplu în care ești un pește care mănâncă alți pești pentru a crește.</CardDescription>
        </CardHeader>
        <CardContent>
          <FishTank />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            <p>Instrucțiuni:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Mișcă mouse-ul pentru a controla peștele tău</li>
              <li>Mănâncă pești mai mici pentru a crește</li>
              <li>Evită peștii mai mari - te vor mânca!</li>
              <li>Scopul este să mănânci toți peștii din acvariu</li>
            </ul>
          </div>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Resetează jocul
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

