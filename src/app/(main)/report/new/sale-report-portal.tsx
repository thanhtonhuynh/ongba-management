"use client";

import { LoadingButton } from "@/components/buttons/LoadingButton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { User } from "@/lib/auth/session";
import { formatVancouverDate } from "@/lib/utils";
import { SaleReportInputs, SaleReportSchema } from "@/lib/validations/report";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { MoveLeft, MoveRight, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { saveReportAction } from "./actions";
import { CashCounterForm } from "./CashCounterForm";
import { ReportPreview } from "./ReportPreview";
import { SaleDetailForm } from "./SaleDetailForm";

const steps = [
  {
    id: "Step 0",
    name: "Sale Details",
    fields: [
      "totalSales",
      "uberEatsSales",
      "doorDashSales",
      "skipTheDishesSales",
      "onlineSales",
      "cardSales",
      "expenses",
      "cardTips",
      "cashTips",
      "extraTips",
      "employees",
    ],
  },
  { id: "Step 1", name: "Count Cash", fields: ["cashInTill"] },
  { id: "Step 2", name: "Review", fields: [] },
  { id: "Step 3", name: "Submit", fields: [] },
];

type FieldName = keyof SaleReportInputs;

type SaleReportPortalProps = {
  usersPromise: Promise<User[]>;
  startCashPromise: Promise<number>;
  initialValues?: SaleReportInputs;
  mode: "create" | "edit";
};

export function SaleReportPortal({
  usersPromise,
  startCashPromise,
  initialValues,
  mode,
}: SaleReportPortalProps) {
  const [isPending, startTransition] = useTransition();
  const saleReportForm = useForm<SaleReportInputs>({
    resolver: zodResolver(SaleReportSchema),
    defaultValues: {
      date: initialValues?.date || new Date(),
      totalSales: initialValues?.totalSales || 0.0,
      uberEatsSales: initialValues?.uberEatsSales || 0.0,
      doorDashSales: initialValues?.doorDashSales || 0.0,
      skipTheDishesSales: initialValues?.skipTheDishesSales || 0.0,
      onlineSales: initialValues?.onlineSales || 0.0,
      cardSales: initialValues?.cardSales || 0.0,
      expenses: initialValues?.expenses || 0.0,
      expensesReason: initialValues?.expensesReason || "",
      cardTips: initialValues?.cardTips || 0.0,
      cashTips: initialValues?.cashTips || 0.0,
      extraTips: initialValues?.extraTips || 0.0,
      cashInTill: initialValues?.cashInTill || 0.0,
      employees: initialValues?.employees || [],
    },
  });
  const cashCounterForm = useForm({
    defaultValues: {
      coin5c: 0,
      coin10c: 0,
      coin25c: 0,
      coin1: 0,
      coin2: 0,
      bill5: 0,
      bill10: 0,
      bill20: 0,
      bill50: 0,
      bill100: 0,
      roll5c: 0,
      roll10c: 0,
      roll25c: 0,
      roll1: 0,
      roll2: 0,
    },
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [previousStep, setPreviousStep] = useState(0);
  const delta = currentStep - previousStep;
  const router = useRouter();

  async function processForm(data: SaleReportInputs) {
    data.date.setHours(0, 0, 0, 0);
    const { error, reportDate } = await saveReportAction(data, mode);
    if (error || !reportDate) toast.error(error);
    else {
      if (mode === "create") {
        router.push("/");
      } else {
        router.push(`/report/${formatVancouverDate(reportDate)}`);
      }
      toast.success("Your report has been saved. Thank you!");
    }
  }

  async function nextStep() {
    const fields = steps[currentStep].fields as FieldName[];
    startTransition(async () => {
      const isValid = await saleReportForm.trigger(fields, {
        shouldFocus: true,
      });
      if (!isValid) {
        return;
      }

      if (currentStep < steps.length - 1) {
        if (currentStep === steps.length - 2) {
          await saleReportForm.handleSubmit(processForm)();
          return;
        }

        setPreviousStep(currentStep);
        setCurrentStep((step) => step + 1);
      }
    });
  }

  function prevStep() {
    if (currentStep > 0) {
      if (currentStep === steps.length - 1) {
        setPreviousStep(currentStep);
        setCurrentStep((step) => step - 2);
        return;
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-between gap-4">
      <nav className="h-1 pt-2 md:h-fit">
        <ol className="flex space-x-8">
          {steps.map((step, index) => (
            <li key={step.name} className="flex-1">
              {currentStep > index ? (
                <div className="border-primary flex w-full flex-col border-t-4 border-l-0 py-2 pl-4 transition-colors md:border-l-0 md:pt-2 md:pb-0 md:pl-0">
                  <span className="hidden text-sm font-semibold md:block">
                    {step.name}
                  </span>
                </div>
              ) : currentStep === index ? (
                <div className="flex w-full flex-col border-t-4 border-l-0 border-blue-500 py-2 pl-4 text-blue-500 md:border-l-0 md:pt-2 md:pb-0 md:pl-0">
                  <span className="hidden text-sm font-semibold md:block">
                    {step.name}
                  </span>
                </div>
              ) : (
                <div className="border-muted flex w-full flex-col border-t-4 border-l-0 py-2 pl-4 transition-colors md:border-l-0 md:pt-2 md:pb-0 md:pl-0">
                  <span className="hidden text-sm font-semibold md:block">
                    {step.name}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {currentStep === 0 && (
        <MotionContainer delta={delta}>
          <h2 className="mt-4 text-center md:hidden">Sale Details</h2>
          <Form {...saleReportForm}>
            <SaleDetailForm usersPromise={usersPromise} />
          </Form>
        </MotionContainer>
      )}

      {currentStep === 1 && (
        <MotionContainer delta={delta}>
          <h2 className="mt-4 text-center md:hidden">Count Cash</h2>
          <CashCounterForm
            saleReportForm={saleReportForm}
            cashCounterForm={cashCounterForm}
          />
        </MotionContainer>
      )}

      {currentStep === 2 && (
        <MotionContainer delta={delta}>
          <h2 className="mt-4 text-center md:hidden">Review</h2>
          <div className="space-y-2 text-sm">
            <p className="border-l-warning bg-muted flex w-fit items-center gap-2 rounded border-l-2 px-2 py-1 font-medium">
              <TriangleAlert size={15} className="text-warning" />
              Please review the report before submitting.
            </p>
            <p className="text-muted-foreground">
              You can go back to make changes or click submit when you're ready.
            </p>
          </div>
          <ReportPreview
            saleReportForm={saleReportForm}
            startCashPromise={startCashPromise}
          />
        </MotionContainer>
      )}

      <div className="mt-4 flex justify-between">
        <Button
          variant={`outline`}
          type="button"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex w-1/4 items-center gap-2"
        >
          <MoveLeft size={15} />
          Back
        </Button>

        {currentStep < steps.length - 1 && (
          <LoadingButton
            type="button"
            onClick={nextStep}
            disabled={currentStep === steps.length - 1}
            loading={isPending}
            className="w-1/4"
          >
            {currentStep < steps.length - 2 ? "Next" : "Save"}
            {currentStep < steps.length - 2 && <MoveRight size={15} />}
          </LoadingButton>
        )}
      </div>
    </div>
  );
}

function MotionContainer({
  delta,
  children,
}: {
  delta: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}
