import { cn } from "../../../utils/cn";
import { Card, CardContent, CardFooter } from "../../../components/ui";
import { Badge } from "../../../components/ui";
import { Button } from "../../../components/ui";

export const OffersList = ({ offers, handleEdit, handleDelete }) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12",
      )}
    >
      {offers.map((o) => (
        <Card
          key={o.id}
          className={cn("flex flex-col justify-between overflow-hidden")}
        >
          <CardContent className={cn("pb-0")}>
            <div className={cn("flex justify-between items-start mb-3")}>
              <Badge variant="brand">{o.discount}</Badge>
              {o.expDate && (
                <Badge
                  variant={
                    new Date(o.expDate) < new Date() ? "error" : "success"
                  }
                  className={cn("text-[10px]")}
                >
                  Exp: {o.expDate}
                </Badge>
              )}
            </div>
            <h3 className={cn("font-bold text-gray-900 text-lg")}>{o.title}</h3>
            {o.code && (
              <p className={cn("text-xs text-gray-500 font-mono mt-1")}>
                CODE: {o.code}
              </p>
            )}
          </CardContent>

          <CardFooter
            className={cn(
              "flex justify-end gap-3 mt-4 bg-transparent border-t",
            )}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(o)}
              className={cn("text-blue-500 hover:text-blue-700")}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(o.id)}
              className={cn("text-red-500 hover:text-red-700")}
            >
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
