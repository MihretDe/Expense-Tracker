import * as React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import TransactionTable from "../components/transaction/TransactionTable";
import CategoryTab from "../components/transaction/CategoryTab";


export default function TransactionPage() {

  const [tab, setTab] = React.useState(0);

  return (
    <Box sx={{ width: "100%", height: 600 }}>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Transactions" />
        <Tab label="Categories" />
      </Tabs>

      {tab === 0 && (
        <TransactionTable  />
      )}

      {tab === 1 && <CategoryTab />}
    </Box>
  );
}
