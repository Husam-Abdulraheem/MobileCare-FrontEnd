import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface RepairOrder {
  id: string;
  dateCreated: Date;
  deviceBrand: string;
  deviceModel: string;
  problemDescription: string;
  status: string;
  estimatedCost: number;
}

interface PreviousRepairsProps {
  repairs: RepairOrder[];
}

function getStatusColor(status: string) {
  switch (status) {
    case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "InProgress": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Ready": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "Collected": return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

function translateStatus(status: string) {
  switch (status) {
    case "Pending": return "قيد الانتظار";
    case "InProgress": return "قيد التنفيذ";
    case "Ready": return "جاهز";
    case "Collected": return "تم الاستلام";
    default: return status;
  }
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
              <TableHead>Problem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {repairs.map((repair) => (
              <TableRow key={repair.id}>
                <TableCell>{format(repair.dateCreated, "PP")}</TableCell>
                <TableCell>{`${repair.deviceBrand} ${repair.deviceModel}`}</TableCell>
                <TableCell className="max-w-xs truncate">{repair.problemDescription}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(repair.status)}`}>
                    {translateStatus(repair.status)}
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
