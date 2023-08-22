// import React from 'react';
// import logo from './logo.svg';
import { useEffect, useMemo, useState } from "react";
import "./App.scss";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  AiOutlineSearch,
  AiOutlinePlus,
  AiOutlineMinus,
  AiFillStar,
} from "react-icons/ai";
import { LuTrash2 } from "react-icons/lu";
import { IoIosCloseCircle } from "react-icons/io";
import { BiSolidSave } from "react-icons/bi";
import InputModal from "./InputModal/InputModal";

const DraggableItem = (props: {
  value: string;
  label: string;
  index: string | number;
  itemType: string;
  stackId: string | number;
  moveItem: Function;
  onDropItem: Function;
  icon: any;
}) => {
  const [, dragRef] = useDrag({
    type: props.itemType,
    item: { value: props.value },
  });

  const [, dropRef] = useDrop({
    accept: props.itemType,
    drop: (draggedItem: any) => {
      props.moveItem(draggedItem.value, props.index);
    },
  });

  return (
    <div
      ref={(node) => {
        dragRef(dropRef(node));
      }}
      onClick={() => {
        let toStack = "";
        switch (props.stackId) {
          case "input1":
            toStack = "input2";
            break;
          case "input2":
            toStack = "input1";
            break;
          case "output1":
            toStack = "output2";
            break;
          case "output2":
            toStack = "output1";
            break;
        }
        props.onDropItem(props.value, toStack);
      }}
      className="dragableItem"
      id={props.value}
    >
      <div className="dragableItemLabel">{props.label}</div>
      <div className={`dragableItemIcon`}>
        <props.icon />
      </div>
    </div>
  );
};

const Stack = (props: {
  stackId: string;
  items: { label: string; value: string }[];
  itemType: string;
  onDropItem: Function;
  moveItem: Function;
  icon: any;
}) => {
  const [, dropRef] = useDrop({
    accept: props.itemType,
    drop: (draggedItem: { label: string; value: string }) => {
      props.onDropItem(draggedItem.value, props.stackId);
    },
  });

  return (
    <div ref={dropRef} className="stack">
      {props.items.map((item: any, index: any) => (
        <DraggableItem
          key={item.value}
          value={item.value}
          label={item.label}
          index={index}
          itemType={props.itemType}
          icon={props.icon}
          stackId={props.stackId}
          moveItem={props.moveItem}
          onDropItem={props.onDropItem}
        />
      ))}
    </div>
  );
};

enum irrOption {
  PAR = "PAR",
  "W/m2" = "W/m2",
  Fraction = "Fraction",
}

type IOption = {
  id: number;
  name: string;
  file_type: {
    input_data: boolean;
    output_data: boolean;
  };
  output_data_time_step: {
    daily: boolean;
    monthly: boolean;
    phenological_stage: boolean;
  };
  input_data_type: {
    structure: boolean;
    crop: boolean;
    soil_information: boolean;
    weather_dataset: boolean;
    ETP_dataset: boolean;
    production_dataset: boolean;
  };
  output_data_type: {
    irr: boolean;
    etp: boolean;
    prod: boolean;
    wc: boolean;
    wd: boolean;
    RU: boolean;
  };
  output_unite: {
    irr: string;
    etp: string;
    prod: string;
    wc: string;
    wd: string;
    RU: string;
  };
  zone_tracked: {
    control_zone: boolean;
    under_panels: boolean;
    between_panels: boolean;
    agri_pv: boolean;
  };
  last_used: string;
};

const DownloadAllModalHook = () => {
  const [isOpen, setIsOpen] = useState(false);

  const options: IOption[] = [
    {
      id: 1,
      name: "All true",
      file_type: {
        input_data: true,
        output_data: true,
      },
      output_data_time_step: {
        daily: true,
        monthly: true,
        phenological_stage: true,
      },
      input_data_type: {
        structure: true,
        crop: true,
        soil_information: true,
        weather_dataset: true,
        ETP_dataset: true,
        production_dataset: true,
      },
      output_data_type: {
        irr: true,
        etp: true,
        prod: true,
        wc: true,
        wd: true,
        RU: true,
      },
      output_unite: {
        irr: "W/m2",
        etp: "mm",
        prod: "Fraction",
        wc: "Fraction",
        wd: "mm",
        RU: "mm",
      },
      zone_tracked: {
        control_zone: true,
        under_panels: true,
        between_panels: true,
        agri_pv: true,
      },
      last_used: "2023-07-23 09:15",
    },
    {
      id: 2,
      name: "All false",
      file_type: {
        input_data: false,
        output_data: false,
      },
      output_data_time_step: {
        daily: false,
        monthly: false,
        phenological_stage: false,
      },
      input_data_type: {
        structure: false,
        crop: false,
        soil_information: false,
        weather_dataset: false,
        ETP_dataset: false,
        production_dataset: false,
      },
      output_data_type: {
        irr: false,
        etp: false,
        prod: false,
        wc: false,
        wd: false,
        RU: false,
      },
      output_unite: {
        irr: "Fraction",
        etp: "mm",
        prod: "kWh/kWc",
        wc: "Fraction",
        wd: "mm",
        RU: "Fraction",
      },
      zone_tracked: {
        control_zone: false,
        under_panels: false,
        between_panels: false,
        agri_pv: false,
      },
      last_used: "2023-02-16 14:30",
    },
    {
      id: 3,
      name: "Just Input",
      file_type: {
        input_data: true,
        output_data: false,
      },
      output_data_time_step: {
        daily: false,
        monthly: false,
        phenological_stage: false,
      },
      input_data_type: {
        structure: true,
        crop: true,
        soil_information: true,
        weather_dataset: true,
        ETP_dataset: true,
        production_dataset: true,
      },
      output_data_type: {
        irr: false,
        etp: false,
        prod: false,
        wc: false,
        wd: false,
        RU: false,
      },
      output_unite: {
        irr: "Fraction",
        etp: "Fraction",
        prod: "Fraction",
        wc: "Fraction",
        wd: "mm",
        RU: "mm",
      },
      zone_tracked: {
        control_zone: false,
        under_panels: false,
        between_panels: false,
        agri_pv: false,
      },
      last_used: "2023-04-30 08:45",
    },
    {
      id: 4,
      name: "Just Output",
      file_type: {
        input_data: false,
        output_data: true,
      },
      output_data_time_step: {
        daily: true,
        monthly: true,
        phenological_stage: true,
      },
      input_data_type: {
        structure: false,
        crop: false,
        soil_information: false,
        weather_dataset: false,
        ETP_dataset: false,
        production_dataset: false,
      },
      output_data_type: {
        irr: true,
        etp: true,
        prod: true,
        wc: true,
        wd: true,
        RU: true,
      },
      output_unite: {
        irr: "PAR",
        etp: "Fraction",
        prod: "kWh/kWc",
        wc: "Fraction",
        wd: "mm",
        RU: "Fraction",
      },
      zone_tracked: {
        control_zone: true,
        under_panels: true,
        between_panels: true,
        agri_pv: true,
      },
      last_used: "2023-03-12 14:20",
    },
  ].sort(
    (a, b) => new Date(b.last_used).getTime() - new Date(a.last_used).getTime()
  );

  const addOption = (option: {
    name: string;
    file_type: {
      input_data: boolean;
      output_data: boolean;
    };
    output_data_time_step: {
      daily: boolean;
      monthly: boolean;
      phenological_stage: boolean;
    };
    input_data_type: {
      structure: boolean;
      crop: boolean;
      soil_information: boolean;
      weather_dataset: boolean;
      ETP_dataset: boolean;
      production_dataset: boolean;
    };
    output_data_type: {
      irr: boolean;
      etp: boolean;
      prod: boolean;
      wc: boolean;
      wd: boolean;
      RU: boolean;
    };
    output_unite: {
      irr: string;
      etp: string;
      prod: string;
      wc: string;
      wd: string;
      RU: string;
    };
    zone_tracked: {
      control_zone: boolean;
      under_panels: boolean;
      between_panels: boolean;
      agri_pv: boolean;
    };
  }) => {
    options.push({
      ...option,
      id: options.length,
      last_used: new Date(Date.now()).toString(),
    });
  };
  const delOption = (index: number) => {
    alert(index);
  };
  const downloadWithOption = (index: number) => {};

  return {
    values: {
      isOpen: isOpen,
      options: options,
    },
    command: {
      setIsOpen: setIsOpen,
      addOption: addOption,
      delOption: delOption,
      downloadWithOption: downloadWithOption,
    },
  };
};

type IDownloadAllModal = {
  options: IOption[];
  isOpen: any;
  onCloseModal: () => void;
  onAddToFavorite: (option: any) => void;
  onDeleteOption: (index: number) => void;
};

const DownloadAllModal = ({
  options,
  isOpen,
  onCloseModal,
  onAddToFavorite,
  onDeleteOption,
}: IDownloadAllModal) => {
  const FilesDataTypes = [
    { value: "input_data", label: "Input Data" },
    { value: "output_data", label: "Output Data" },
  ];
  const [outputDataTimeStep, setOutputDataTimeStep] = useState({
    daily: true,
    monthly: true,
    phenological_stage: true,
  });

  const InputDataOptions = [
    { value: "structure", label: "Structure" },
    { value: "crop", label: "Crop" },
    { value: "soil_information", label: "Soil Information" },
    { value: "weather_dataset", label: "Weather Dataset" },
    { value: "ETP_dataset", label: "ETP Dataset" },
    { value: "production_dataset", label: "Production Dataset" },
  ];

  const OutputDataOptions = [
    { value: "irr", label: "Irradiance" },
    { value: "etp", label: "Evapotranspiration" },
    { value: "prod", label: "Production" },
    { value: "wc", label: "Water Consumption" },
    { value: "wd", label: "Water Deficit" },
    { value: "RU", label: "Available Water Stock" },
  ];

  const [searchValue, setSearchValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<IOption | null>(null);

  const [filesTypesValues, setFilesTypesValues] = useState({
    input_data: true,
    output_data: true,
  });
  const [filesTimeStepValues, setFilesTimeStepValues] = useState({
    daily: true,
    monthly: true,
    phenological_stage: true,
  });

  const [inputDataTypeSelected, setInputDataTypeSelected] = useState<
    { label: string; value: string }[]
  >([]);
  const [inputDataTypeNotSelected, setInputDataTypeNotSelected] =
    useState<{ label: string; value: string }[]>(InputDataOptions);

  const [outputDataTypeSelected, setOutputDataTypeSelected] = useState<
    { label: string; value: string }[]
  >([]);
  const [outputDataTypeNotSelected, setOutputDataTypeNotSelected] =
    useState<{ label: string; value: string }[]>(OutputDataOptions);

  const [outputDataUnite, setOutputDataUnite] = useState<{
    irr: string;
    etp: string;
    prod: string;
    wc: string;
    wd: string;
    RU: string;
  }>({ irr: "W/m2", etp: "mm", prod: "kWh/kWc", wc: "mm", wd: "mm", RU: "mm" });

  const [outputZoneTracked, setOutputZoneTracked] = useState<{
    control_zone: boolean;
    under_panels: boolean;
    between_panels: boolean;
    agri_pv: boolean;
  }>({
    control_zone: true,
    under_panels: true,
    between_panels: true,
    agri_pv: true,
  });

  const handleDeleteOption =
    (index: number) =>
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
      onDeleteOption(index);
    };

  const handleDropItem = (itemValue: string, targetStackId: string) => {
    switch (targetStackId) {
      case "input1":
      case "input2":
        if (!filesTypesValues.input_data) return;
        if (
          targetStackId === "input1" &&
          !inputDataTypeNotSelected.find((item) => item.value == itemValue)
        ) {
          setInputDataTypeNotSelected((prevItems: any) =>
            prevItems.concat(
              inputDataTypeSelected.find(
                (item: any) => item.value === itemValue
              ) as any
            )
          );
          setInputDataTypeSelected((prevItems: any) =>
            prevItems.filter((item: any) => item.value !== itemValue)
          );
        } else if (
          targetStackId === "input2" &&
          !inputDataTypeSelected.find((item) => item.value == itemValue)
        ) {
          setInputDataTypeSelected((prevItems: any) =>
            prevItems.concat(
              inputDataTypeNotSelected.find(
                (item: any) => item.value === itemValue
              ) as any
            )
          );
          setInputDataTypeNotSelected((prevItems: any) =>
            prevItems.filter((item: any) => item.value !== itemValue)
          );
        }
        break;
      case "output1":
      case "output2":
        if (!filesTypesValues.output_data) return;
        if (
          targetStackId === "output1" &&
          !outputDataTypeNotSelected.find((item) => item.value == itemValue)
        ) {
          setOutputDataTypeNotSelected((prevItems: any) =>
            prevItems.concat(
              outputDataTypeSelected.find(
                (item: any) => item.value === itemValue
              ) as any
            )
          );
          setOutputDataTypeSelected((prevItems: any) =>
            prevItems.filter((item: any) => item.value !== itemValue)
          );
        } else if (
          targetStackId === "output2" &&
          !outputDataTypeSelected.find((item) => item.value == itemValue)
        ) {
          setOutputDataTypeSelected((prevItems: any) =>
            prevItems.concat(
              outputDataTypeNotSelected.find(
                (item: any) => item.value === itemValue
              ) as any
            )
          );
          setOutputDataTypeNotSelected((prevItems: any) =>
            prevItems.filter((item: any) => item.value !== itemValue)
          );
        }
        break;
    }
  };

  const handleMoveItem =
    (stack: any, setStack: Function) => (elementValue: any, toIndex: any) => {
      if (stack == outputDataTypeNotSelected || stack == outputDataTypeSelected)
        if (!filesTypesValues.output_data) return;
      if (stack == inputDataTypeNotSelected || stack == inputDataTypeSelected)
        if (!filesTypesValues.input_data) return;
      const reorderedItems = [...stack];
      const [movedItem] = reorderedItems.splice(
        stack.findIndex((item: any) => item.value == elementValue),
        1
      );
      reorderedItems.splice(toIndex, 0, movedItem);
      setStack([...reorderedItems]);
    };

  useEffect(() => {
    if (isOpen) {
      setSelectedOption(null);
      setFilesTypesValues({
        input_data: true,
        output_data: true,
      });
      setFilesTimeStepValues({
        daily: true,
        monthly: true,
        phenological_stage: true,
      });

      setInputDataTypeNotSelected(InputDataOptions);
      setInputDataTypeSelected([]);
    }
  }, [isOpen]);

  useEffect(() => {
    console.log("inputDataTypeNotSelected", inputDataTypeNotSelected);
  }, [inputDataTypeNotSelected]);

  useEffect(() => {
    if (selectedOption) {
      setFilesTypesValues({
        input_data: selectedOption.file_type.input_data,
        output_data: selectedOption.file_type.output_data,
      });
      setFilesTimeStepValues({
        daily: selectedOption.output_data_time_step.daily,
        monthly: selectedOption.output_data_time_step.monthly,
        phenological_stage:
          selectedOption.output_data_time_step.phenological_stage,
      });

      setInputDataTypeNotSelected(
        Object.values(selectedOption.input_data_type)
          .map((value: boolean, index: number) =>
            !value
              ? InputDataOptions.find(
                  (item) =>
                    item.value ==
                    Object.keys(selectedOption.input_data_type)[index]
                )
              : undefined
          )
          .filter((item) => item != undefined) as any[]
      );
      setInputDataTypeSelected(
        Object.values(selectedOption.input_data_type)
          .map((value: boolean, index: number) =>
            value
              ? InputDataOptions.find(
                  (item) =>
                    item.value ==
                    Object.keys(selectedOption.input_data_type)[index]
                )
              : undefined
          )
          .filter((item) => item != undefined) as any[]
      );

      setOutputDataTypeNotSelected(
        Object.values(selectedOption.output_data_type)
          .map((value: boolean, index: number) =>
            !value
              ? OutputDataOptions.find(
                  (item) =>
                    item.value ==
                    Object.keys(selectedOption.output_data_type)[index]
                )
              : undefined
          )
          .filter((item) => item != undefined) as any[]
      );
      setOutputDataTypeSelected(
        Object.values(selectedOption.output_data_type)
          .map((value: boolean, index: number) =>
            value
              ? OutputDataOptions.find(
                  (item) =>
                    item.value ==
                    Object.keys(selectedOption.output_data_type)[index]
                )
              : undefined
          )
          .filter((item) => item != undefined) as any[]
      );

      setOutputDataUnite({ ...selectedOption.output_unite });

      setOutputZoneTracked({ ...selectedOption.zone_tracked });
    }
  }, [selectedOption]);

  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [nameModalError, setNameModalError] = useState("");

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      console.log(`nameModalOpen: ${nameModalOpen}`);
      if (e.key == "Escape") {
        if (nameModalOpen) setNameModalOpen(false);
        else onCloseModal();
      }
    };
    if (isOpen) window.addEventListener("keyup", onKeyUp);
    return () => window.removeEventListener("keyup", onKeyUp);
  }, [isOpen, nameModalOpen]);

  const onSubmitName = (s: string) => {
    if (!s.length || s.length > 50) {
      setNameModalError("Name length must be in range of 1 to 50.");
      return;
    }

    // let saveObject: {
    //   name: string;
    //   file_type: {
    //     input_data: boolean;
    //     output_data: boolean;
    //   };
    //   output_data_time_step: {
    //     daily: boolean;
    //     monthly: boolean;
    //     phenological_stage: boolean;
    //   };
    //   input_data_type: {
    //     structure: boolean;
    //     crop: boolean;
    //     soil_information: boolean;
    //     weather_dataset: boolean;
    //     ETP_dataset: boolean;
    //     production_dataset: boolean;
    //   };
    //   output_data_type: {
    //     irr: boolean;
    //     etp: boolean;
    //     prod: boolean;
    //     wc: boolean;
    //     wd: boolean;
    //     RU: boolean;
    //   };
    //   output_unite: {
    //     irr: string;
    //     etp: string;
    //     prod: string;
    //     wc: string;
    //     wd: string;
    //     RU: string;
    //   };
    //   zone_tracked: {
    //     control_zone: boolean;
    //     under_panels: boolean;
    //     between_panels: boolean;
    //     agri_pv: boolean;
    //   };
    // } = {
    //   name: s,
    //   file_type: filesTypesValues,
    //   output_data_time_step: OutputDataTimeStep,
    // };

    setNameModalError("");
    setNameModalOpen(false);
  };

  if (!isOpen) return <></>;
  else
    return (
      <div className="backgroundModal">
        <div className="downloadAllModal">
          <div className="cross" onClick={onCloseModal}>
            <IoIosCloseCircle />
          </div>

          <div className="downloadOptionSelector">
            <div className="downloadOptionSearchBar">
              <AiOutlineSearch />
              <input
                type="text"
                placeholder="Search Option Name"
                value={searchValue}
                onChange={(e) => setSearchValue(e.currentTarget.value)}
              />
            </div>
            {options
              .filter((item: IOption) =>
                item.name.toLowerCase().includes(searchValue.toLowerCase())
              )
              .map((option: IOption) => (
                <div
                  key={option.id}
                  className={
                    "downloadOptionItem" +
                    (selectedOption && selectedOption.id == option.id
                      ? " selected"
                      : "")
                  }
                  onClick={() => {
                    setSelectedOption(option);
                  }}
                >
                  <div className="itemName">
                    {option.name}
                    <div
                      onClick={(e) => handleDeleteOption(option.id)(e as any)}
                    >
                      <LuTrash2 />
                    </div>
                  </div>
                  <div className="itemLastUsed">{option.last_used}</div>
                </div>
              ))}
          </div>
          <div className="limiter" />
          <div className="downloadAllModalMain">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div className="downloadOptionCreator">
                <div className="downloadOptionCreatorContainer">
                  <div className="fileTypeSelector">
                    <div className="label">Select data type :</div>
                    <div className="checkBoxContainer">
                      <div
                        className="checkBox"
                        onClick={() => {
                          setFilesTypesValues((prev) => ({
                            ...prev,
                            input_data: !prev.input_data,
                          }));
                        }}
                      >
                        <div className="checkBoxLabel">Input Data</div>
                        <input
                          readOnly
                          className="checkbox"
                          type="checkbox"
                          checked={filesTypesValues.input_data}
                        />
                      </div>
                      <div
                        className="checkBox"
                        onClick={() => {
                          setFilesTypesValues((prev) => ({
                            ...prev,
                            output_data: !prev.output_data,
                          }));
                        }}
                      >
                        <div className="checkBoxLabel">Output Data</div>
                        <input
                          readOnly
                          className="checkbox"
                          type="checkbox"
                          checked={filesTypesValues.output_data}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={
                      "fileTypeSelector" +
                      (filesTypesValues.output_data ? "" : " disable")
                    }
                  >
                    <div className="label">Select Output time step :</div>
                    <div className="checkBoxContainer">
                      <div
                        className="checkBox"
                        onClick={() => {
                          if (filesTypesValues.output_data)
                            setOutputDataTimeStep((prev) => ({
                              ...prev,
                              daily: !prev.daily,
                            }));
                        }}
                      >
                        <div className="checkBoxLabel">Daily</div>
                        <input
                          readOnly
                          className="checkbox"
                          type="checkbox"
                          checked={outputDataTimeStep.daily}
                        />
                      </div>
                      <div
                        className="checkBox"
                        onClick={() => {
                          if (filesTypesValues.output_data)
                            setOutputDataTimeStep((prev) => ({
                              ...prev,
                              monthly: !prev.monthly,
                            }));
                        }}
                      >
                        <div className="checkBoxLabel">Monthly</div>
                        <input
                          readOnly
                          className="checkbox"
                          type="checkbox"
                          checked={outputDataTimeStep.monthly}
                        />
                      </div>
                      <div
                        className="checkBox"
                        onClick={() => {
                          if (filesTypesValues.output_data)
                            setOutputDataTimeStep((prev) => ({
                              ...prev,
                              phenological_stage: !prev.phenological_stage,
                            }));
                        }}
                      >
                        <div className="checkBoxLabel">Phenological Stage</div>
                        <input
                          readOnly
                          className="checkbox"
                          type="checkbox"
                          checked={outputDataTimeStep.phenological_stage}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    id="irrUniteSelector"
                    className={`fileTypeSelector  unite ${
                      outputDataTypeNotSelected.find(
                        (item) => item.value == "irr"
                      ) || !filesTypesValues.output_data
                        ? "disable"
                        : ""
                    }`}
                    onMouseEnter={() => {
                      if (
                        filesTypesValues.output_data &&
                        outputDataTypeNotSelected.find(
                          (item) => item.value == "irr"
                        )
                      ) {
                        document
                          .getElementById("irr")
                          ?.animate([{ color: "red" }], {
                            // temporisation
                            duration: 250,
                            iterations: 1,
                            fill: "forwards",
                          });
                      }
                    }}
                    onMouseLeave={() => {
                      if (
                        filesTypesValues.output_data &&
                        outputDataTypeNotSelected.find(
                          (item) => item.value == "irr"
                        )
                      ) {
                        document
                          .getElementById("irr")
                          ?.animate([{ color: "black" }], {
                            // temporisation
                            duration: 250,
                            iterations: 1,
                            fill: "both",
                          });
                      }
                    }}
                  >
                    <div className="label">Select Irradiance Unite :</div>
                    <div className="checkBoxContainer">
                      <div
                        className="checkBox"
                        onClick={() => {
                          if (
                            !(
                              outputDataTypeNotSelected.find(
                                (item) => item.value == "irr"
                              ) || !filesTypesValues.output_data
                            )
                          )
                            setOutputDataUnite((prev) => ({
                              ...prev,
                              irr: "W/m2",
                            }));
                        }}
                      >
                        <div className="checkBoxLabel">W/m2</div>
                        <input
                          readOnly
                          className="checkbox"
                          type="checkbox"
                          checked={outputDataUnite.irr == "W/m2"}
                        />
                      </div>
                      <div
                        className="checkBox"
                        onClick={() => {
                          if (
                            !(
                              outputDataTypeNotSelected.find(
                                (item) => item.value == "irr"
                              ) || !filesTypesValues.output_data
                            )
                          )
                            setOutputDataUnite((prev) => ({
                              ...prev,
                              irr: "PAR",
                            }));
                        }}
                      >
                        <div className="checkBoxLabel">PAR</div>
                        <input
                          readOnly
                          className="checkbox"
                          type="checkbox"
                          checked={outputDataUnite.irr == "PAR"}
                        />
                      </div>
                      <div
                        className="checkBox"
                        onClick={() => {
                          if (
                            !(
                              outputDataTypeNotSelected.find(
                                (item) => item.value == "irr"
                              ) || !filesTypesValues.output_data
                            )
                          )
                            setOutputDataUnite((prev) => ({
                              ...prev,
                              irr: "Fraction",
                            }));
                        }}
                      >
                        <div className="checkBoxLabel">Fraction</div>
                        <input
                          readOnly
                          className="checkbox"
                          type="checkbox"
                          checked={outputDataUnite.irr == "Fraction"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="downloadOptionCreatorContainer">
                  <div
                    className={`fileContentSelector notSelected ${
                      !filesTypesValues.input_data ? "disabled" : ""
                    }`}
                  >
                    <div className="fileContentSelectorLabel">
                      Input Data Content:
                    </div>
                    <DndProvider backend={HTML5Backend}>
                      <div className="fileOptionsSelectorContainer">
                        <div className="stackContainer add">
                          <div className="stackLabel">Not Selected</div>
                          <Stack
                            stackId={"input1"}
                            items={inputDataTypeNotSelected}
                            itemType="INPUT"
                            icon={AiOutlinePlus}
                            onDropItem={handleDropItem}
                            moveItem={handleMoveItem(
                              inputDataTypeNotSelected,
                              setInputDataTypeNotSelected
                            )}
                          />
                        </div>
                      </div>
                    </DndProvider>
                  </div>
                  <div
                    className={`fileContentSelector notSelected  ${
                      !filesTypesValues.output_data ? "disabled" : ""
                    }`}
                  >
                    <div className="fileContentSelectorLabel">
                      Output Data Content:
                    </div>
                    <DndProvider backend={HTML5Backend}>
                      <div className={"fileOptionsSelectorContainer"}>
                        <div className="stackContainer add">
                          <div className="stackLabel">Not Selected</div>
                          <Stack
                            stackId={"output1"}
                            items={outputDataTypeNotSelected}
                            itemType="OUTPUT"
                            icon={AiOutlinePlus}
                            onDropItem={handleDropItem}
                            moveItem={handleMoveItem(
                              outputDataTypeNotSelected,
                              setOutputDataTypeNotSelected
                            )}
                          />
                        </div>
                      </div>
                    </DndProvider>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: ".5rem",
                    }}
                  >
                    <div
                      className={`fileTypeSelector  unite ${
                        outputDataTypeNotSelected.find(
                          (item) => item.value == "prod"
                        ) || !filesTypesValues.output_data
                          ? "disable"
                          : ""
                      }`}
                      onMouseEnter={() => {
                        if (
                          filesTypesValues.output_data &&
                          outputDataTypeNotSelected.find(
                            (item) => item.value == "prod"
                          )
                        ) {
                          document
                            .getElementById("prod")
                            ?.animate([{ color: "red" }], {
                              duration: 250,
                              iterations: 1,
                              fill: "forwards",
                            });
                        }
                      }}
                      onMouseLeave={() => {
                        if (
                          filesTypesValues.output_data &&
                          outputDataTypeNotSelected.find(
                            (item) => item.value == "prod"
                          )
                        ) {
                          document
                            .getElementById("prod")
                            ?.animate([{ color: "black" }], {
                              duration: 250,
                              iterations: 1,
                              fill: "both",
                            });
                        }
                      }}
                    >
                      <div className="label">Select Production Unite :</div>
                      <div className="checkBoxContainer">
                        <div
                          className="checkBox"
                          onClick={() => {
                            if (
                              !(
                                outputDataTypeNotSelected.find(
                                  (item) => item.value == "prod"
                                ) || !filesTypesValues.output_data
                              )
                            )
                              setOutputDataUnite((prev) => ({
                                ...prev,
                                prod: "kWh/kWc",
                              }));
                          }}
                        >
                          <div className="checkBoxLabel">kWh/kWc</div>
                          <input
                            readOnly
                            className="checkbox"
                            type="checkbox"
                            checked={outputDataUnite.prod == "kWh/kWc"}
                          />
                        </div>
                        <div
                          className="checkBox"
                          onClick={() => {
                            if (
                              !(
                                outputDataTypeNotSelected.find(
                                  (item) => item.value == "prod"
                                ) || !filesTypesValues.output_data
                              )
                            )
                              setOutputDataUnite((prev) => ({
                                ...prev,
                                prod: "Fraction",
                              }));
                          }}
                        >
                          <div className="checkBoxLabel">Fraction</div>
                          <input
                            readOnly
                            className="checkbox"
                            type="checkbox"
                            checked={outputDataUnite.prod == "Fraction"}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className={`fileTypeSelector  unite ${
                        outputDataTypeNotSelected.find(
                          (item) => item.value == "etp"
                        ) || !filesTypesValues.output_data
                          ? "disable"
                          : ""
                      }`}
                      onMouseEnter={() => {
                        if (
                          filesTypesValues.output_data &&
                          outputDataTypeNotSelected.find(
                            (item) => item.value == "etp"
                          )
                        ) {
                          document
                            .getElementById("etp")
                            ?.animate([{ color: "red" }], {
                              duration: 250,
                              iterations: 1,
                              fill: "forwards",
                            });
                        }
                      }}
                      onMouseLeave={() => {
                        if (
                          filesTypesValues.output_data &&
                          outputDataTypeNotSelected.find(
                            (item) => item.value == "etp"
                          )
                        ) {
                          document
                            .getElementById("etp")
                            ?.animate([{ color: "black" }], {
                              duration: 250,
                              iterations: 1,
                              fill: "both",
                            });
                        }
                      }}
                    >
                      <div className="label">Select ETP Unite :</div>
                      <div className="checkBoxContainer">
                        <div
                          className="checkBox"
                          onClick={() => {
                            if (
                              !(
                                outputDataTypeNotSelected.find(
                                  (item) => item.value == "etp"
                                ) || !filesTypesValues.output_data
                              )
                            )
                              setOutputDataUnite((prev) => ({
                                ...prev,
                                etp: "mm",
                              }));
                          }}
                        >
                          <div className="checkBoxLabel">mm</div>
                          <input
                            readOnly
                            className="checkbox"
                            type="checkbox"
                            checked={outputDataUnite.etp == "mm"}
                          />
                        </div>
                        <div
                          className="checkBox"
                          onClick={() => {
                            if (
                              !(
                                outputDataTypeNotSelected.find(
                                  (item) => item.value == "etp"
                                ) || !filesTypesValues.output_data
                              )
                            )
                              setOutputDataUnite((prev) => ({
                                ...prev,
                                etp: "Fraction",
                              }));
                          }}
                        >
                          <div className="checkBoxLabel">Fraction</div>
                          <input
                            readOnly
                            className="checkbox"
                            type="checkbox"
                            checked={outputDataUnite.etp == "Fraction"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="downloadOptionCreatorContainer">
                  <div
                    className={`fileTypeSelector unite ${
                      outputDataTypeNotSelected.find(
                        (item) => item.value == "wc"
                      ) || !filesTypesValues.output_data
                        ? "disable"
                        : ""
                    }`}
                    onMouseEnter={() => {
                      if (
                        filesTypesValues.output_data &&
                        outputDataTypeNotSelected.find(
                          (item) => item.value == "wc"
                        )
                      ) {
                        document
                          .getElementById("wc")
                          ?.animate([{ color: "red" }], {
                            duration: 250,
                            iterations: 1,
                            fill: "forwards",
                          });
                      }
                    }}
                    onMouseLeave={() => {
                      if (
                        filesTypesValues.output_data &&
                        outputDataTypeNotSelected.find(
                          (item) => item.value == "wc"
                        )
                      ) {
                        document
                          .getElementById("wc")
                          ?.animate([{ color: "black" }], {
                            duration: 250,
                            iterations: 1,
                            fill: "both",
                          });
                      }
                    }}
                  >
                    <div className="label">
                      Select Water Consumption Unite :
                    </div>
                    <div className="checkBoxContainer">
                      <div
                        className="checkBox"
                        onClick={() => {
                          if (
                            !(
                              outputDataTypeNotSelected.find(
                                (item) => item.value == "wc"
                              ) || !filesTypesValues.output_data
                            )
                          )
                            setOutputDataUnite((prev) => ({
                              ...prev,
                              wc: "mm",
                            }));
                        }}
                      >
                        <div className="checkBoxLabel">mm</div>
                        <input
                          readOnly
                          className="checkbox"
                          type="checkbox"
                          checked={outputDataUnite.wc == "mm"}
                        />
                      </div>
                      <div
                        className="checkBox"
                        onClick={() => {
                          if (
                            !(
                              outputDataTypeNotSelected.find(
                                (item) => item.value == "wc"
                              ) || !filesTypesValues.output_data
                            )
                          )
                            setOutputDataUnite((prev) => ({
                              ...prev,
                              wc: "Fraction",
                            }));
                        }}
                      >
                        <div className="checkBoxLabel">Fraction</div>
                        <input
                          readOnly
                          className="checkbox"
                          type="checkbox"
                          checked={outputDataUnite.wc == "Fraction"}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={`fileTypeSelector  unite ${
                      outputDataTypeNotSelected.find(
                        (item) => item.value == "wd"
                      ) || !filesTypesValues.output_data
                        ? "disable"
                        : ""
                    }`}
                    onMouseEnter={() => {
                      if (
                        filesTypesValues.output_data &&
                        outputDataTypeNotSelected.find(
                          (item) => item.value == "wd"
                        )
                      ) {
                        document
                          .getElementById("wd")
                          ?.animate([{ color: "red" }], {
                            duration: 250,
                            iterations: 1,
                            fill: "forwards",
                          });
                      }
                    }}
                    onMouseLeave={() => {
                      if (
                        filesTypesValues.output_data &&
                        outputDataTypeNotSelected.find(
                          (item) => item.value == "wd"
                        )
                      ) {
                        document
                          .getElementById("wd")
                          ?.animate([{ color: "black" }], {
                            duration: 250,
                            iterations: 1,
                            fill: "both",
                          });
                      }
                    }}
                  >
                    <div className="label">Select Water Deficit Unite :</div>
                    <div className="checkBoxContainer">
                      <div
                        className="checkBox"
                        onClick={() => {
                          if (
                            !(
                              outputDataTypeNotSelected.find(
                                (item) => item.value == "wd"
                              ) || !filesTypesValues.output_data
                            )
                          )
                            setOutputDataUnite((prev) => ({
                              ...prev,
                              wd: "mm",
                            }));
                        }}
                      >
                        <div className="checkBoxLabel">mm</div>
                        <input
                          readOnly
                          className="checkbox"
                          type="checkbox"
                          checked={outputDataUnite.wd == "mm"}
                        />
                      </div>
                      <div
                        className="checkBox"
                        onClick={() => {
                          if (
                            !(
                              outputDataTypeNotSelected.find(
                                (item) => item.value == "wd"
                              ) || !filesTypesValues.output_data
                            )
                          )
                            setOutputDataUnite((prev) => ({
                              ...prev,
                              wd: "Fraction",
                            }));
                        }}
                      >
                        <div className="checkBoxLabel">Fraction</div>
                        <input
                          readOnly
                          className="checkbox"
                          type="checkbox"
                          checked={outputDataUnite.wd == "Fraction"}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className={`fileTypeSelector  unite ${
                      outputDataTypeNotSelected.find(
                        (item) => item.value == "RU"
                      ) || !filesTypesValues.output_data
                        ? "disable"
                        : ""
                    }`}
                    onMouseEnter={() => {
                      if (
                        filesTypesValues.output_data &&
                        outputDataTypeNotSelected.find(
                          (item) => item.value == "RU"
                        )
                      ) {
                        document
                          .getElementById("RU")
                          ?.animate([{ color: "red" }], {
                            duration: 250,
                            iterations: 1,
                            fill: "forwards",
                          });
                      }
                    }}
                    onMouseLeave={() => {
                      if (
                        filesTypesValues.output_data &&
                        outputDataTypeNotSelected.find(
                          (item) => item.value == "RU"
                        )
                      ) {
                        document
                          .getElementById("RU")
                          ?.animate([{ color: "black" }], {
                            duration: 250,
                            iterations: 1,
                            fill: "both",
                          });
                      }
                    }}
                  >
                    <div className="label">
                      Select Available Water Stock Unite :
                    </div>
                    <div className="checkBoxContainer">
                      <div
                        className="checkBox"
                        onClick={() => {
                          if (
                            !(
                              outputDataTypeNotSelected.find(
                                (item) => item.value == "RU"
                              ) || !filesTypesValues.output_data
                            )
                          )
                            setOutputDataUnite((prev) => ({
                              ...prev,
                              RU: "mm",
                            }));
                        }}
                      >
                        <div className="checkBoxLabel">mm</div>
                        <input
                          readOnly
                          className="checkbox"
                          type="checkbox"
                          checked={outputDataUnite.RU == "mm"}
                        />
                      </div>
                      <div
                        className="checkBox"
                        onClick={() => {
                          if (
                            !(
                              outputDataTypeNotSelected.find(
                                (item) => item.value == "RU"
                              ) || !filesTypesValues.output_data
                            )
                          )
                            setOutputDataUnite((prev) => ({
                              ...prev,
                              RU: "Fraction",
                            }));
                        }}
                      >
                        <div className="checkBoxLabel">Fraction</div>
                        <input
                          readOnly
                          className="checkbox"
                          type="checkbox"
                          checked={outputDataUnite.RU == "Fraction"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="optionsSelected">
                <div
                  className={`fileContentSelector selected ${
                    !filesTypesValues.input_data ? "disabled" : ""
                  }`}
                >
                  <div className="fileContentSelectorLabel">
                    Input Data Content:
                  </div>
                  <DndProvider backend={HTML5Backend}>
                    <div className="fileOptionsSelectorContainer">
                      <div className={`stackContainer remove`}>
                        <div className="stackLabel">Input Selected</div>
                        <Stack
                          stackId={"input2"}
                          items={inputDataTypeSelected}
                          itemType="INPUT"
                          icon={AiOutlineMinus}
                          onDropItem={handleDropItem}
                          moveItem={handleMoveItem(
                            inputDataTypeSelected,
                            setInputDataTypeSelected
                          )}
                        />
                      </div>
                    </div>
                  </DndProvider>
                </div>
                <div
                  className={`fileContentSelector selected ${
                    !filesTypesValues.output_data ? "disabled" : ""
                  }`}
                >
                  <div className="fileContentSelectorLabel">
                    Output Data Content:
                  </div>
                  <DndProvider backend={HTML5Backend}>
                    <div className="fileOptionsSelectorContainer">
                      <div className={`stackContainer remove`}>
                        <div className="stackLabel">Output Selected</div>
                        <Stack
                          stackId={"output2"}
                          items={outputDataTypeSelected}
                          itemType="OUTPUT"
                          icon={AiOutlineMinus}
                          onDropItem={handleDropItem}
                          moveItem={handleMoveItem(
                            outputDataTypeSelected,
                            setOutputDataTypeSelected
                          )}
                        />
                      </div>
                    </div>
                  </DndProvider>
                </div>
                <div
                  className={`fileTypeSelector zone ${
                    !filesTypesValues.output_data ? "disable" : ""
                  }`}
                >
                  <div className="label">Select Tracked Zone :</div>
                  <div className="checkBoxContainer">
                    <div
                      className="checkBox"
                      onClick={() => {
                        if (filesTypesValues.output_data)
                          setOutputZoneTracked((prev) => ({
                            ...prev,
                            control_zone: !prev.control_zone,
                          }));
                      }}
                    >
                      <div className="checkBoxLabel">Control Zone</div>
                      <input
                        readOnly
                        className="checkbox"
                        type="checkbox"
                        checked={outputZoneTracked.control_zone}
                      />
                    </div>
                    <div
                      className="checkBox"
                      onClick={() => {
                        if (filesTypesValues.output_data)
                          setOutputZoneTracked((prev) => ({
                            ...prev,
                            under_panels: !prev.under_panels,
                          }));
                      }}
                    >
                      <div className="checkBoxLabel">Under Panels</div>
                      <input
                        readOnly
                        className="checkbox"
                        type="checkbox"
                        checked={outputZoneTracked.under_panels}
                      />
                    </div>
                    <div
                      className="checkBox"
                      onClick={() => {
                        if (filesTypesValues.output_data)
                          setOutputZoneTracked((prev) => ({
                            ...prev,
                            between_panels: !prev.between_panels,
                          }));
                      }}
                    >
                      <div className="checkBoxLabel">Between Panels</div>
                      <input
                        readOnly
                        className="checkbox"
                        type="checkbox"
                        checked={outputZoneTracked.between_panels}
                      />
                    </div>
                    <div
                      className="checkBox"
                      onClick={() => {
                        if (filesTypesValues.output_data)
                          setOutputZoneTracked((prev) => ({
                            ...prev,
                            agri_pv: !prev.agri_pv,
                          }));
                      }}
                    >
                      <div className="checkBoxLabel">Agri PV</div>
                      <input
                        readOnly
                        className="checkbox"
                        type="checkbox"
                        checked={outputZoneTracked.agri_pv}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="saveAndDownloadContainer">
              <button
                className="save"
                onClick={() => {
                  setNameModalOpen(true);
                }}
              >
                <AiFillStar />
                Save to favorite
              </button>
              <button className="download">
                <BiSolidSave />
                Download
              </button>
            </div>
          </div>
        </div>
        <InputModal
          label="Select Name for New Option :"
          isOpen={nameModalOpen}
          buttonLabel="Save"
          onSubmit={onSubmitName}
          error={nameModalError}
        />
      </div>
    );
};

function App() {
  const {
    values: { isOpen, options },
    command: { setIsOpen, addOption, delOption },
  } = DownloadAllModalHook();

  return (
    <div className="app">
      <button
        className="mainButton"
        onClick={(e) => {
          setIsOpen(!isOpen);
        }}
      >
        Download
      </button>
      <DownloadAllModal
        options={options}
        isOpen={isOpen}
        onCloseModal={() => {
          setIsOpen((prev) => !prev);
        }}
        onAddToFavorite={addOption}
        onDeleteOption={delOption}
      />
    </div>
  );
}

export default App;
