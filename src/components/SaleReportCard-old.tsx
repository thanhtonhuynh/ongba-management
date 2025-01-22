// "use client";

// import { formatPrice } from "@/lib/utils";
// import moment from "moment";
// import { Separator } from "./ui/separator";
// import { MoveRight } from "lucide-react";
// import { SaleReportCardProcessedData } from "@/types";
// import { ProfilePicture } from "./ProfilePicture";

// type SaleReportProps = {
//   data: SaleReportCardProcessedData | undefined;
// };

// export function SaleReportCard({ data }: SaleReportProps) {
//   if (!data) {
//     return null;
//   }

//   return (
//     <div className="w-full space-y-1 rounded border p-2 text-sm shadow">
//       <div className="flex items-center justify-between space-x-2 pb-1">
//         <div className="font-semibold">
//           {moment(data.date).format("ddd MMM Do, YYYY")}
//         </div>

//         <div className="flex items-center space-x-1">
//           {data.reporterImage && (
//             <ProfilePicture image={data.reporterImage} size={40} />
//           )}
//           <span className="font-medium">{data.reporterName}</span>
//         </div>
//       </div>

//       <Separator />

//       <div>
//         <span className="font-semibold">Total: </span>
//         {formatPrice(data.inStoreSales)} + {formatPrice(data.otherSales)} ={" "}
//         {formatPrice(data.totalSales)}
//       </div>

//       <Separator />

//       <div className="grid grid-cols-2">
//         <div>UE: {formatPrice(data.uberEatsSales)}</div>
//         <div>DD: {formatPrice(data.doorDashSales)}</div>
//         <div>SK: {formatPrice(data.skipTheDishesSales)}</div>
//         <div>ON: {formatPrice(data.onlineSales)}</div>
//       </div>

//       <Separator />

//       <div>
//         <span className="font-semibold">Card sales: </span>
//         {formatPrice(data.cardSales)}
//       </div>

//       <Separator />

//       <div className="">
//         <span className="font-semibold">Cash: </span>
//         {formatPrice(data.cashSales)}
//       </div>

//       <Separator />

//       <div>
//         <span className="font-semibold">Expenses: </span>
//         {formatPrice(data.expenses)}{" "}
//         {data.expensesReason && `(${data.expensesReason})`}
//       </div>

//       <Separator />

//       <div>
//         <span className="font-semibold">Actual Cash: </span>
//         {formatPrice(data.actualCash)}
//       </div>

//       <Separator />

//       <div>
//         <span className="font-semibold">Cash Difference: </span>(
//         {formatPrice(data.cashInTill)} - {data.startCash}) -{" "}
//         {formatPrice(data.actualCash)} = {formatPrice(data.cashDifference)}
//       </div>

//       <Separator />

//       <div className="flex items-center gap-4">
//         <div>
//           <div>
//             <span className="font-semibold">Card Tips: </span>
//             {formatPrice(data.cardTips)}
//           </div>
//           <div>
//             <span className="font-semibold">Cash Tips: </span>
//             {formatPrice(data.cashTips)}
//           </div>
//           <div>
//             <span className="font-semibold">Extra Tips: </span>
//             {formatPrice(data.extraTips)}
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <MoveRight size={20} />
//           {formatPrice(data.totalTips)}
//         </div>
//       </div>

//       <Separator />

//       <div>
//         <span className="font-semibold">Cash Out: </span>(
//         {formatPrice(data.cashInTill)} - {data.startCash}) +{" "}
//         {formatPrice(data.cashTips)} = {formatPrice(data.cashOut)}
//       </div>

//       <Separator />

//       <div className="pb-1">
//         <span className="font-semibold">Tips Breakdown: </span>{" "}
//         {formatPrice(data.totalTips)} / {data.totalPeople} ={" "}
//         {formatPrice(data.tipsPerPerson)}
//       </div>

//       <div className="space-y-2">
//         {data.employees.map((emp) => (
//           <div key={emp.userId} className="flex items-center space-x-2">
//             {emp.image && <ProfilePicture image={emp.image} size={40} />}
//             <span>{emp.name}:</span>
//             <span>
//               {data.totalPeople > 1
//                 ? emp.fullDay
//                   ? formatPrice(data.tipsPerPerson)
//                   : formatPrice(data.tipsPerPerson / 2)
//                 : formatPrice(data.totalTips)}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
