import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { labels } from "@/types";

export default function Stats() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          {labels.map((item, idx) => {
            return <TableHead key={idx}>{item}</TableHead>;
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          {labels.map((item, idx) => {
            return (
              <TableCell
                className=" text-slate-900 dark:text-white"
                key={idx}
                id={item}
              >
                ?
              </TableCell>
            );
          })}
        </TableRow>
      </TableBody>
    </Table>
  );
}
