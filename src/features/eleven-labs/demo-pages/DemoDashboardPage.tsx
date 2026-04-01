import {
  Box,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";

import Joyride, {
  STATUS,
  type Step,
  type CallBackProps,
} from "react-joyride";

import { Table, type Column } from "@/shared/ui/Table";
import { DashboardTableSection } from "@/features/dashboard/components/DashboardTableSection";

import formatEuros from "@/shared/lib/formatMoney";

import type { Expense } from "@/features/expenses/types/expenses.responses";
import type { Income } from "@/features/incomes/types/incomes.responses";

import { MobileTransactionCard } from "@/shared/mobile/MobileTransactionCard";
import { DashboardTimelineChart } from "@/features/dashboard/components/DashboardTimelineChart";

import { EmptyState } from "@/shared/ui/EmptyState";

import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";
import { useMemo, useState, useEffect } from "react";

type DashboardData = {
  balance: number;
  totalIncomes: number;
  totalExpenses: number;
  incomes: Income[];
  expenses: Expense[];
};

export default function DemoDashboardPage() {

  const isMobile = useMediaQuery("(max-width:600px)");

  const navigate = useNavigate();

  const [stepIndex, setStepIndex] = useState(0);

  const [runTour, setRunTour] = useState(true);


  /*
  fake demo data
  */

  const data: DashboardData = useMemo(
    () => ({
      balance: 2840,

      totalIncomes: 3200,

      totalExpenses: 360,


      incomes: [
        {
          id: 1,
          description: "Salary",

          amount: 2500,

          createdAt: dayjs().subtract(2, "day").toISOString(),

          groupId: 1,

          groupName: "Job",
        },

        {
          id: 2,
          description: "Freelance",

          amount: 700,

          createdAt: dayjs().subtract(4, "day").toISOString(),

          groupId: 2,

          groupName: "Side Hustle",
        },
      ],


      expenses: [
        {
          id: 1,

          description: "Groceries",

          amount: 120,

          createdAt: dayjs().subtract(1, "day").toISOString(),

          groupId: 3,

          groupName: "Food",
        },

        {
          id: 2,

          description: "Gym",

          amount: 40,

          createdAt: dayjs().subtract(3, "day").toISOString(),

          groupId: 4,

          groupName: "Health",
        },

        {
          id: 3,

          description: "Fuel",

          amount: 200,

          createdAt: dayjs().subtract(6, "day").toISOString(),

          groupId: 5,

          groupName: "Transport",
        },
      ],
    }),
    []
  );


  /*
  table columns
  */

  const txColumns: Column<Expense | Income>[] = [

    {
      key: "description",

      header: "Description",

      render: (tx) => tx.description,
    },

    {
      key: "amount",

      header: "Amount",

      align: "right",

      render: (tx) => formatEuros(tx.amount),
    },

    {
      key: "date",

      header: "Date",

      render: (tx) =>
        new Date(tx.createdAt).toLocaleDateString(),
    },

    {
      key: "group",

      header: "Group",

      render: (tx) => tx.groupName,
    },
  ];


  /*
  chart demo data
  */

  const timelineData = [

    {
      date: dayjs().subtract(6, "day").toISOString(),

      income: 0,

      expense: 200,
    },

    {
      date: dayjs().subtract(5, "day").toISOString(),

      income: 700,

      expense: 0,
    },

    {
      date: dayjs().subtract(3, "day").toISOString(),

      income: 0,

      expense: 40,
    },

    {
      date: dayjs().subtract(2, "day").toISOString(),

      income: 2500,

      expense: 0,
    },

    {
      date: dayjs().subtract(1, "day").toISOString(),

      income: 0,

      expense: 120,
    },
  ];


  /*
  joyride steps
  */

  const steps: Step[] = [

    {
      target: "[data-tour='balance']",

      content:
        "This is your current balance based on tracked income and expenses.",

      disableBeacon: true,
    },


    ...(!isMobile
      ? [
          {
            target: "[data-tour='chart']",

            content:
              "This chart shows how your balance changes over time.",
          },
        ]
      : []),


    {
      target: "[data-tour='income-section']",

      content:
        "All income sources are displayed here.",
    },


    {
      target: "[data-tour='expense-section']",

      content:
        "Track where your money is being spent.",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {

    const { index, status, type } = data;


    if (type === "step:after") {

      setStepIndex(index + 1);

    }


    if (
      status === STATUS.FINISHED ||
      status === STATUS.SKIPPED
    ) {

      setRunTour(false);

      navigate("/onboarding/incomes");

    }

  };

  useEffect(() => {
  const next = () => {
    setStepIndex((prev) => prev + 1)
  }

  const prev = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0))
  }

  const finish = () => {
    setRunTour(false)
    navigate("/onboarding/incomes")
  }

  window.addEventListener("onboarding_next", next)
  window.addEventListener("onboarding_prev", prev)
  window.addEventListener("onboarding_finish", finish)

  return () => {
    window.removeEventListener("onboarding_next", next)
    window.removeEventListener("onboarding_prev", prev)
    window.removeEventListener("onboarding_finish", finish)
  }
}, [navigate])


  return (

    <Box
      sx={{
        display: "flex",

        flexDirection: "column",
      }}
    >


      <Joyride
        steps={steps}

        run={runTour}

        stepIndex={stepIndex}

        continuous

        showSkipButton

        scrollToFirstStep

        disableOverlayClose

        spotlightPadding={10}

        callback={handleJoyrideCallback}


        styles={{

          options: {

            zIndex: 9999,

            primaryColor: "#6366f1",

            backgroundColor: "#0f172a",

            overlayColor: "rgba(2,6,23,0.65)",

            textColor: "#e2e8f0",

            arrowColor: "#0f172a",
          },


          tooltip: {

            borderRadius: 16,

            padding: 18,

            boxShadow:
              "0 25px 70px rgba(0,0,0,0.55)",

            border:
              "1px solid rgba(255,255,255,0.06)",

            fontSize: 14,
          },


          buttonNext: {

            background: "#6366f1",

            borderRadius: 8,

            fontWeight: 600,
          },


          buttonBack: {

            marginRight: 8,

            color: "#94a3b8",
          },


          buttonSkip: {

            color: "#64748b",
          },


          spotlight: {

            borderRadius: 14,
          },
        }}


        locale={{

          back: "Back",

          close: "Close",

          last: "Finish",

          next: "Next",

          skip: "Skip",
        }}
      />


      {/* balance */}

      <Paper
        data-tour="balance"

        sx={{

          p: 3,

          mb: 4,

          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",
        }}
      >

        <Box>

          <Typography
            variant="subtitle1"

            color="text.secondary"
          >
            Current balance:
          </Typography>


          <Typography
            variant={isMobile ? "h5" : "h3"}

            fontWeight={700}
          >
            {formatEuros(data.balance)}
          </Typography>

        </Box>

      </Paper>



      {!isMobile && (

        <Paper
          data-tour="chart"

          sx={{
            mb: 2,

            p: 2,
          }}
        >

          <DashboardTimelineChart data={timelineData} />

        </Paper>

      )}



      <Box
        sx={{
          display: "flex",

          flexDirection: "column",

          gap: 3,
        }}
      >


        {!isMobile && (

          <>

            <Box data-tour="income-section">

              <DashboardTableSection
                title="Total Incomes"

                total={data.totalIncomes}

                color="success.main"

                sign="+"
              >

                <Table
                  rows={data.incomes}

                  columns={txColumns}

                  getRowKey={(tx) => tx.id}

                  onRowClick={(tx) =>
                    navigate(
                      `/app/incomes?search=${tx.description}`
                    )
                  }
                />

              </DashboardTableSection>

            </Box>



            <Box data-tour="expense-section">

              <DashboardTableSection
                title="Total Expenses"

                total={data.totalExpenses}

                color="error.main"

                sign="-"
              >

                <Table
                  rows={data.expenses}

                  columns={txColumns}

                  getRowKey={(tx) => tx.id}

                  onRowClick={(tx) =>
                    navigate(
                      `/app/expenses?search=${tx.description}`
                    )
                  }
                />

              </DashboardTableSection>

            </Box>

          </>

        )}



        {isMobile && (

          <>

            <Box data-tour="income-section">

              <DashboardTableSection
                title="Total Incomes"

                total={data.totalIncomes}

                color="success.main"

                sign="+"
              >

                <MobileTransactionCard
                  data={data.incomes}

                  color="success.main"

                  onClick={(tx) =>
                    navigate(
                      `/app/incomes?search=${tx.description}`
                    )
                  }
                />

              </DashboardTableSection>

            </Box>



            <Box data-tour="expense-section">

              <DashboardTableSection
                title="Total Expenses"

                total={data.totalExpenses}

                color="error.main"

                sign="-"
              >

                <MobileTransactionCard
                  data={data.expenses}

                  color="error.main"

                  onClick={(tx) =>
                    navigate(
                      `/app/expenses?search=${tx.description}`
                    )
                  }
                />

              </DashboardTableSection>

            </Box>

          </>

        )}

      </Box>

    </Box>

  );

}