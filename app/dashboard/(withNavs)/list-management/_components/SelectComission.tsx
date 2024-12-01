import React, { useState } from "react";
import Link from "next/link";
import { ArrowDownIcon } from "@/assets/svgs";
import {
  OptionType,
  SMSelectDropDown,
  TextField,
  Typography,
} from "@/components";
import { useGetCommissionsQuery } from "@/redux/api/property";

export const SelectComission = ({
  commissonValue,
  setCommisonValue,
}: {
  commissonValue: string;
  setCommisonValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { data, isFetching } = useGetCommissionsQuery(undefined);
  const commissions: OptionType[] =
    data?.data.map((data) => ({ label: data.name, value: data?.id })) ?? [];

  const [activeField, setActiveField] = useState<"input" | "select" | null>(
    null,
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommisonValue(e.target.value);
    setActiveField("input");
  };

  const handleSelectChange = (value: OptionType) => {
    setCommisonValue(value.value);
    setActiveField("select");
  };

  return (
    <div className="flex flex-col gap-2">
      <Typography gutterBottom variant="p-m" className="text-base">
        Set Commission on this specific listing or use the existing commission
        configuration
      </Typography>

      <div>
        <TextField
          label="Unique Listing Commission"
          name="fixedValue"
          placeholder="Set a Value"
          type="number"
          value={activeField === "input" ? commissonValue : ""}
          onChange={handleInputChange}
          // disabled={activeField === "select"}
        />
        <Typography color="N100" variant={"c-s"} className="mt-2">
          Enter Single Value (Not in % but amount)
        </Typography>
      </div>

      <div className="mt-6 flex justify-between border-t border-solid border-N40 pt-8">
        <Typography variant="h-s">Existing Commission Configuration</Typography>
        <Link href="/dashboard/configurations">
          <Typography
            color={"R500"}
            className="group flex cursor-pointer items-center gap-2"
          >
            Manage{" "}
            <span className="-rotate-90 text-black group-hover:text-[inherit]">
              <ArrowDownIcon />
            </span>
          </Typography>
        </Link>
      </div>

      <div className="flex flex-col gap-2">
        <Typography variant="c-m" className="text-[#344054]">
          Select Configuration
        </Typography>
        <SMSelectDropDown
          options={commissions}
          disabled={isFetching}
          // @ts-expect-error
          value={
            activeField === "input"
              ? null
              : commissions.filter((value) => value.value === commissonValue)[0]
          }
          onChange={handleSelectChange}
          placeholder="Select Configuration"
          isMulti={false}
          loading={isFetching}
          id="configuration"
          name="configuration"
        />
      </div>
    </div>
  );
};
