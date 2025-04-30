
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface RepairOrder {
  id: string;
  dateCreated: Date;
  deviceBrand: string;
  deviceModel: string;
  issueDescription: string;
  status: string;
  estimatedCost: number;
}

interface PreviousRepairsProps {
  repairs: RepairOrder[];
}

export function PreviousRepairs({ repairs }: PreviousRepairsProps) {
  if (repairs.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium mb-4">Previous Repairs</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repairs.map((repair) => (
              <TableRow key={repair.id}>
                <TableCell>{format(repair.dateCreated, "PP")}</TableCell>
                <TableCell>{`${repair.deviceBrand} ${repair.deviceModel}`}</TableCell>
                <TableCell className="max-w-xs truncate">{repair.issueDescription}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${repair.status === "Completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : 
                    repair.status === "Pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" : 
                    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"}`}>
                    {repair.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">${repair.estimatedCost.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
