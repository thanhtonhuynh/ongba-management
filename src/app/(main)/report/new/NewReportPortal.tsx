"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@/components/LoadingButton";
import {
  CreateReportSchema,
  CreateReportSchemaTypes,
} from "@/lib/report/validation";
import { User } from "@/lib/auth/session";
import { createReportAction } from "./actions";
import { CashCounterForm } from "./CashCounterForm";
import { SaleDetailForm } from "./SaleDetailForm";
import { CircleAlert, CircleCheck, MoveLeft, MoveRight } from "lucide-react";
import { motion } from "framer-motion";
import { ReportPreview } from "./ReportPreview";
import { Button } from "@/components/ui/button";

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

type FieldName = keyof CreateReportSchemaTypes;

export function NewReportPortal({ users }: { users: User[] }) {
  const [error, setError] = useState<string>();
  const [isPending, startTransition] = useTransition();
  const createReportForm = useForm<CreateReportSchemaTypes>({
    resolver: zodResolver(CreateReportSchema),
    defaultValues: {
      saleTotal: 0.0,
      uberEatsSales: 0.0,
      doorDashSales: 0.0,
      skipTheDishesSales: 0.0,
      onlineSales: 0.0,
      cardTotal: 0.0,
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

  async function processForm(data: CreateReportSchemaTypes) {
    const { error } = await createReportAction(data);
    if (error) setError(error);
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
        }

        setPreviousStep(currentStep);
        setCurrentStep((step) => step + 1);
      }
    });
  }

  function prevStep() {
    if (currentStep > 0) {
      if (currentStep === steps.length - 1) {
        setError(undefined);
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
      <nav className="hidden md:block">
        <ol className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-2">
                  <span className="text-sm font-semibold">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div className="flex w-full flex-col border-l-4 border-primary py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-2">
                  <span className="text-sm font-semibold">{step.name}</span>
                </div>
              ) : (
                <div className="flex w-full flex-col border-l-4 border-muted py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-2">
                  <span className="text-sm font-semibold">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {currentStep === 0 && (
        <MotionContainer delta={delta}>
          <h2 className="text-center text-lg font-semibold md:hidden">
            Sale Details
          </h2>
          <SaleDetailForm users={users} form={createReportForm} />
        </MotionContainer>
      )}

      {currentStep === 1 && (
        <MotionContainer delta={delta}>
          <h2 className="text-center text-lg font-semibold md:hidden">
            Count Cash
          </h2>
          <CashCounterForm
            createReportForm={createReportForm}
            cashCounterForm={cashCounterForm}
          />
        </MotionContainer>
      )}

      {currentStep === 2 && (
        <MotionContainer delta={delta}>
          <ReportPreview createReportForm={createReportForm} users={users} />
        </MotionContainer>
      )}

      {currentStep === 3 && (
        <MotionContainer delta={delta}>
          <div className="mb-2 flex flex-col space-y-4">
            <h2
              className={`flex w-fit items-center gap-2 rounded p-1 px-2 text-lg font-semibold text-secondary ${error ? "bg-destructive" : "bg-green-500"}`}
            >
              {error ? <CircleAlert size={20} /> : <CircleCheck size={20} />}
              {error ? "Report Submission Failed!" : "Report Submitted!"}
            </h2>
            <p className="text-sm">
              {error
                ? error
                : "Your report has been submitted successfully. Good night!"}
            </p>
          </div>

          <ReportPreview createReportForm={createReportForm} users={users} />
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
      {children}
    </motion.div>
  );
}
