import type { api } from "@sunday/monday/api";
import { Button } from "@sunday/ui/components/button";
import { useRouter } from "next/navigation";
import { Image } from "~/components/miscellaneous/image";

type HouseCardProps = (typeof api.houses.getUserHouses._returnType)[number];

export function HouseCard(props: HouseCardProps) {
  const { _id, name, address, image } = props;
  const router = useRouter();

  return (
    <Button
      variant={"outline"}
      size={"none"}
      className="aspect-[12/14] !rounded-2xl flex-col justify-start items-start p-2"
      onClick={() => router.push(`/houses/${_id}`)}
      onMouseEnter={() => router.prefetch(`/houses/${_id}`)}
    >
      <div className="relative rounded-md overflow-hidden aspect-video w-full h-auto">
        {image ? (
          <Image
            src={image.url}
            alt={image.name}
            fill
            className="object-cover absolute inset-0"
          />
        ) : (
          <div className="absolute inset-0 bg-accent flex items-center justify-center">
            <p className="text-sm text-muted-foreground">No image</p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 px-2 w-full items-start">
        <p className="text-lg/6 font-bold tracking-tight truncate">{name}</p>
        <p className="text-sm/4 font-medium text-muted-foreground truncate">
          {address}
        </p>
      </div>
    </Button>
  );
}
