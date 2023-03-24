import React, { useState, useEffect, useRef, memo, useCallback } from "react";
import styles from "./infoBoxes.module.css";
import { v4 as uuidv4 } from "uuid";
import { GrAdd } from "react-icons/gr";
import { MdOutlineRemove } from "react-icons/md";
import { useScroll, useTransform } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromSelectedMembersForProcess,
  setMembersSetForProcess,
  setSelectedMembersForProcess,
  setSelectedWorkflowsToDoc,
} from "../../../../../features/app/appSlice";
import Collapse from "../../../../../layouts/collapse/Collapse";
import { LoadingSpinner } from "../../../../LoadingSpinner/LoadingSpinner";
import { useForm } from "react-hook-form";
import {
  InfoBoxContainer,
  InfoContentBox,
  InfoContentContainer,
  InfoContentText,
  InfoSearchbar,
  InfoTitleBox,
} from "../../../../infoBox/styledComponents";
import {
  allWorkflows,
  savedWorkflows,
} from "../../../../../features/workflow/asyncTHunks";
import { toast } from "react-toastify";

const InfoBoxes = () => {
  const { register, watch } = useForm();
  const { workflow, team } = watch();

  const ref = useRef(null);
  const dispatch = useDispatch();

  const { userDetail } = useSelector((state) => state.auth);
  const {
    currentDocToWfs,
    selectedWorkflowsToDoc,
    selectedMembersForProcess,
    docCurrentWorkflow,
    membersSetForProcess,
  } = useSelector((state) => state.app);
  const { allWorkflows: allWorkflowsArray, allWorkflowsStatus } = useSelector(
    (state) => state.workflow
  );
  const { contentOfDocument, savedDocumentsItems } = useSelector(
    (state) => state.document
  );
  const [compInfoBoxes, setCompInfoBoxes] = useState(infoBoxes);

  useEffect(() => {
    const data = {
      company_id: userDetail?.portfolio_info[0].org_id,
    };

    dispatch(allWorkflows(data.company_id));
  }, []);

  const memorizedInfoBox = useCallback(() => {
    setCompInfoBoxes((prev) =>
      prev.map((item) =>
        item.title === "workflow"
          ? {
              ...item,
              contents:
                team?.length > 1
                  ? allWorkflowsArray?.filter((item) =>
                      item.created_by
                        .toLocaleLowerCase()
                        .includes(team?.toLocaleLowerCase())
                    )
                  : allWorkflowsArray?.filter((item) =>
                      item.workflows?.workflow_title
                        .toLowerCase()
                        .includes(workflow?.toLowerCase())
                    ),
              status: allWorkflowsStatus,
            }
          : item.title === "team"
          ? {
              ...item,
              contents:
                team?.length > 1
                  ? userDetail?.userportfolio ?
                    userDetail?.userportfolio
                      .filter((user) => user.member_type === "team_member")
                      .filter((user) =>
                        Array.isArray(user.username) && user.username.length > 0
                          ? user.username[0]
                              .toLocaleLowerCase()
                              .includes(team.toLocaleLowerCase())
                          : user.username
                              .toLocaleLowerCase()
                              .includes(team.toLocaleLowerCase())
                      )
                    :
                    userDetail?.selected_product?.userportfolio
                      .filter((user) => user.member_type === "team_member")
                      .filter((user) =>
                        Array.isArray(user.username) && user.username.length > 0
                          ? user.username[0]
                              .toLocaleLowerCase()
                              .includes(team.toLocaleLowerCase())
                          : user.username
                              .toLocaleLowerCase()
                              .includes(team.toLocaleLowerCase())
                      )
                  : userDetail?.userportfolio ?
                    userDetail?.userportfolio.filter(
                      (user) => user.member_type === "team_member"
                    )
                    :
                    userDetail?.selected_product?.userportfolio.filter(
                      (user) => user.member_type === "team_member"
                    ),
              status: "done",
            }
          : item.title === "user"
          ? {
              ...item,
              contents: userDetail?.userportfolio ?
                userDetail?.userportfolio.filter(
                  (user) => user.member_type === "public"
                ) 
                :  
                userDetail?.selected_product?.userportfolio.filter(
                  (user) => user.member_type === "public"
                )
              ,
              status: "done",
            }
          : item
      )
    );
  }, [allWorkflowsStatus, workflow, team, userDetail]);

  useEffect(() => {
    memorizedInfoBox();
  }, [memorizedInfoBox]);

  useEffect(() => {
    if (membersSetForProcess) return;

    if (userDetail.userportfolio) {
      userDetail.userportfolio?.forEach((user) => {
        if (Array.isArray(user.username) && user.username.length > 0) {
          user.username.forEach((arrUsername) => {
            const copyOfUser = { ...user };
            copyOfUser.username = arrUsername;
  
            if (
              selectedMembersForProcess.find(
                (member) => member.username === copyOfUser.username
              )
            )
              return dispatch(
                removeFromSelectedMembersForProcess(copyOfUser.username)
              );
            dispatch(setSelectedMembersForProcess(copyOfUser));
          });
  
          return;
        }
  
        if (
          selectedMembersForProcess.find((member) =>
            member.username === Array.isArray(user.username) &&
            user.username.length > 0
              ? user.username[0]
              : user.username
          )
        )
          return dispatch(
            removeFromSelectedMembersForProcess(
              Array.isArray(user.username) && user.username.length > 0
                ? user.username[0]
                : user.username
            )
          );
        dispatch(setSelectedMembersForProcess(user));
      });

      dispatch(setMembersSetForProcess(true));
      return
    }

    userDetail.selected_product?.userportfolio?.forEach((user) => {
      if (Array.isArray(user.username) && user.username.length > 0) {
        user.username.forEach((arrUsername) => {
          const copyOfUser = { ...user };
          copyOfUser.username = arrUsername;

          if (
            selectedMembersForProcess.find(
              (member) => member.username === copyOfUser.username
            )
          )
            return dispatch(
              removeFromSelectedMembersForProcess(copyOfUser.username)
            );
          dispatch(setSelectedMembersForProcess(copyOfUser));
        });

        return;
      }

      if (
        selectedMembersForProcess.find((member) =>
          member.username === Array.isArray(user.username) &&
          user.username.length > 0
            ? user.username[0]
            : user.username
        )
      )
        return dispatch(
          removeFromSelectedMembersForProcess(
            Array.isArray(user.username) && user.username.length > 0
              ? user.username[0]
              : user.username
          )
        );
      dispatch(setSelectedMembersForProcess(user));
    });

    dispatch(setMembersSetForProcess(true));
  }, [userDetail, currentDocToWfs, membersSetForProcess]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["200px", "-200px"]);

  const handleTogleBox = (id) => {
    const updatedInfoBoxes = compInfoBoxes.map((item) =>
      item.id === id ? { ...item, isOpen: !item.isOpen } : item
    );

    setCompInfoBoxes(updatedInfoBoxes);
  };

  const addToSelectedWorkFlows = (selectedWorkFlow) => {
    if (selectedWorkFlow.member_type && selectedWorkFlow.username) {
      return;
      // if (selectedMembersForProcess.find(member => member.username === selectedWorkFlow.username)) return dispatch(removeFromSelectedMembersForProcess(selectedWorkFlow.username))
      // return dispatch(setSelectedMembersForProcess(selectedWorkFlow));
    }

    if (currentDocToWfs) {
      const isInclude = selectedWorkflowsToDoc.find(
        (item) => item._id === selectedWorkFlow._id
      );
      if (!isInclude) {
        dispatch(setSelectedWorkflowsToDoc(selectedWorkFlow));
      }
    } else {
      toast.info("Please pick a document first.")
      // alert("u have to pick document first");
    }
  };

  return (
    <div ref={ref} style={{ y: y }} className={styles.container}>
      {compInfoBoxes?.map((infoBox) => (
        <InfoBoxContainer key={infoBox.id} className={styles.box}>
          <InfoTitleBox
            style={{ pointerEvents: infoBox?.status === "pending" && "none" }}
            onClick={currentDocToWfs ? () => handleTogleBox(infoBox.id) : () => toast.info("Please select a document first.")}
            /*  className={styles.title__box} */
          >
            {infoBox.status && infoBox.status === "pending" ? (
              <LoadingSpinner />
            ) : (
              <>
                <div
                  style={{
                    marginRight: "8px",
                    fontSize: "14px",
                  }}
                >
                  {infoBox.isOpen ? <MdOutlineRemove /> : <GrAdd />}
                </div>
                <a>{infoBox.title}</a>
              </>
            )}
          </InfoTitleBox>

          <Collapse open={!infoBox.isOpen}>
            <InfoContentContainer>
              <InfoSearchbar
                placeholder="Search"
                {...register(`${infoBox.title}`)}
              />

              <InfoContentBox className={styles.content__box}>
                {/* <>{console.log(infoBox)}</> */}
                {infoBox && infoBox.contents && infoBox.contents.length > 0 ? (
                  [...infoBox?.contents].reverse().map((item, index) =>
                    item.username ? (
                      Array.isArray(item.username) ? (
                        <>
                          {React.Children.toArray(
                            item.username.map((user, userIndex) => {
                              return (
                                <InfoContentText
                                  key={user + crypto.randomUUID()}
                                  /* className={styles.content} */
                                >
                                  <span>{userIndex + 1 === 1 ? index + 1 : userIndex + 1}. {user}</span>
                                </InfoContentText>
                              );
                            })
                          )}
                        </>
                      ) : (
                        <InfoContentText
                          key={item.username + crypto.randomUUID()}
                          /* className={styles.content} */
                        >
                          <span>{index + 1}. {item.username}</span>
                        </InfoContentText>
                      )
                    ) : (
                      <InfoContentText
                        onClick={() => addToSelectedWorkFlows(item)}
                        key={item._id}
                        className={styles.content__text}
                      >
                        <div
                          style={
                            // item.username ? selectedMembersForProcess.find(member => member.username === item.username) ? { color: "#0048ff"} : {} :
                            item.workflows && item._id
                              ? selectedWorkflowsToDoc.find(
                                  (addedWorkflow) =>
                                    addedWorkflow._id === item._id
                                )
                                ? {
                                    backgroundColor: "#0048ff",
                                    color: "#fff",
                                    padding: "2% 3%",
                                    borderRadius: "5px",
                                    width: "100%",
                                    cursor: "pointer",
                                  }
                                : {
                                    cursor: "pointer",
                                  }
                              : {}
                          }
                        >
                          {index + 1}. {item.workflows &&
                            item.workflows.workflow_title &&
                            item.workflows.workflow_title}
                        </div>
                      </InfoContentText>
                    )
                  )
                ) : (
                  <></>
                )}
              </InfoContentBox>
            </InfoContentContainer>
          </Collapse>
        </InfoBoxContainer>
      ))}
    </div>
  );
};

export default memo(InfoBoxes);

export const infoBoxes = [
  {
    id: uuidv4(),
    title: "workflow",
    contents: [],
    isOpen: true,
  },
  {
    id: uuidv4(),
    title: "team",
    contents: [],
    isOpen: true,
  },
  {
    id: uuidv4(),
    title: "user",
    contents: [],
    isOpen: true,
  },
];
