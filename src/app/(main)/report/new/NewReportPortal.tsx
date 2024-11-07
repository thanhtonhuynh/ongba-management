"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@/components/buttons/LoadingButton";
import {
  CreateReportSchema,
  CreateReportSchemaInput,
} from "@/lib/validations/report";
import { User } from "@/lib/auth/session";
import { createReportAction } from "./actions";
import { CashCounterForm } from "./CashCounterForm";
import { SaleDetailForm } from "./SaleDetailForm";
import { MoveLeft, MoveRight, TriangleAlert } from "lucide-react";
import { motion } from "framer-motion";
import { ReportPreview } from "./ReportPreview";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const steps = [
  {
    id: "Step 1",
    name: "Sale Details",
    fields: [
      "saleTotal",
      "uberEatsSales",
      "doorDashSales",
      "skipTheDishesSales",
      "onlineSales",
      "cardTotal",
      "expenses",
      "cardTips",
      "cashTips",
      "extraTips",
      "employees",
    ],
  },
  { id: "Step 2", name: "Count Cash", fields: ["cashInTill"] },
  { id: "Step 3", name: "Review", fields: [] },
  { id: "Step 4", name: "Submit", fields: [] },
];

type FieldName = keyof CreateReportSchemaInput;

type NewReportPortalProps = {
  users: User[];
  startCash: number;
};

export function NewReportPortal({ users, startCash }: NewReportPortalProps) {
  const [isPending, startTransition] = useTransition();
  const createReportForm = useForm<CreateReportSchemaInput>({
    resolver: zodResolver(CreateReportSchema),
    defaultValues: {
      totalSales: 0.0,
      uberEatsSales: 0.0,
      doorDashSales: 0.0,
      skipTheDishesSales: 0.0,
      onlineSales: 0.0,
      cardSales: 0.0,
      expenses: 0.0,
      expensesReason: "",
      cardTips: 0.0,
      cashTips: 0.0,
      extraTips: 0.0,
      cashInTill: 0.0,
      employees: [],
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

  async function processForm(data: CreateReportSchemaInput) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    const isoString = date.toISOString();

    const { error } = await createReportAction(data, isoString);
    if (error) toast.error(error);
    else {
      router.push("/");
      toast.success("Your report has been submitted. Thank you!");
    }
  }

  async function nextStep() {
    const fields = steps[currentStep].fields;
    startTransition(async () => {
      const isValid = await createReportForm.trigger(fields as FieldName[], {
        shouldFocus: true,
      });
      if (!isValid) return;

      if (currentStep < steps.length - 1) {
        if (currentStep === steps.length - 2) {
          await createReportForm.handleSubmit(processForm)();
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
    <>
      <nav className="h-1 pt-2 md:h-fit">
        <ol className="flex space-x-8">
          {steps.map((step, index) => (
            <li key={step.name} className="flex-1">
              {currentStep > index ? (
                <div className="flex w-full flex-col border-l-0 border-t-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:pb-0 md:pl-0 md:pt-2">
                  <span className="hidden text-sm font-semibold md:block">
                    {step.name}
                  </span>
                </div>
              ) : currentStep === index ? (
                <div className="flex w-full flex-col border-l-0 border-t-4 border-blue-500 py-2 pl-4 text-blue-500 md:border-l-0 md:pb-0 md:pl-0 md:pt-2">
                  <span className="hidden text-sm font-semibold md:block">
                    {step.name}
                  </span>
                </div>
              ) : (
                <div className="flex w-full flex-col border-l-0 border-t-4 border-muted py-2 pl-4 transition-colors md:border-l-0 md:pb-0 md:pl-0 md:pt-2">
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
          <h2 className="pt-2 text-center text-lg md:hidden">Sale Details</h2>

          <SaleDetailForm users={users} form={createReportForm} />
        </MotionContainer>
      )}

      {currentStep === 1 && (
        <MotionContainer delta={delta}>
          <h2 className="pt-2 text-center text-lg md:hidden">Count Cash</h2>

          <CashCounterForm
            createReportForm={createReportForm}
            cashCounterForm={cashCounterForm}
          />
        </MotionContainer>
      )}

      {currentStep === 2 && (
        <MotionContainer delta={delta}>
          <h2 className="pt-2 text-center text-lg md:hidden">Review</h2>

          <div className="space-y-2 text-sm">
            <p className="flex w-fit items-center gap-2 rounded border-l-2 border-l-warning bg-muted px-2 py-1 font-medium">
              <TriangleAlert size={15} className="text-warning" />
              Please review the report before submitting.
            </p>

            <p className="text-muted-foreground">
              You can go back to make changes or click submit when you're ready.
            </p>
          </div>

          <ReportPreview
            createReportForm={createReportForm}
            startCash={startCash}
          />
        </MotionContainer>
      )}

      <div className="flex justify-between">
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
            {currentStep < steps.length - 2 ? "Next" : "Submit"}
            {currentStep < steps.length - 2 && <MoveRight size={15} />}
          </LoadingButton>
        )}
      </div>
    </>
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
