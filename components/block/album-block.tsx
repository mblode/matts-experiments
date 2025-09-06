import { Button } from "../ui/button";

export const AlbumBlock = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Albums</h2>
        <p className="text-sm text-muted-foreground">Manage your albums</p>
      </div>
      <div className="flex flex-col gap-2">
        <Button variant="secondary">Create Album</Button>
        <Button variant="secondary">Import Album</Button>
      </div>
    </div>
  );
};
