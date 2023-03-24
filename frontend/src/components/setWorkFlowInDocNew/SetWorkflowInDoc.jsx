import { useRef } from "react";
import ConnectWorkFlowToDoc from "./steps/connectWebflowToDoc/ConnectWorkFlowToDoc";
import SelectDoc from "./steps/selectDoc/SelectDoc";
import SelectWorkflow from "./steps/selectWorkflow/SelectWorkflow";
import styles from "./setWorkflowInDoc.module.css";
import CheckErrors from "./steps/checkErrors/CheckErrors";
import ProcessDocument from "./steps/processDocument/ProcessDocument";
import CustomerSupport from "./customerSupport/CustomerSupport";
import ContentMapOfDoc from "./contentMapOfDoc/ContentMapOfDoc";
import globalStyles from "./globalStyles.css";
import WorkflowLayout from "../../layouts/WorkflowLayout/WorkflowLayout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetSetWorkflows, setContinents, setContinentsLoaded } from "../../features/app/appSlice";
import { setContentOfDocument } from "../../features/document/documentSlice";
import { getContinents } from "../../services/locationServices";
import { useSearchParams } from "react-router-dom";
import { getSingleProcessV2 } from "../../services/processServices";

const SetWorkflowInDoc = () => {
  const dispatch = useDispatch();
  const { userDetail, session_id } = useSelector(state => state.auth);
  const { continentsLoaded, allProcesses } = useSelector(state => state.app);
  const [ searchParams, setSearchParams ] = useSearchParams();

  useEffect(() => {
    dispatch(resetSetWorkflows());
    dispatch(setContentOfDocument(null));

    if (continentsLoaded) return

    getContinents(userDetail?.userinfo?.username, session_id).then(res => {
      const formattedContinents = res.data.map(item => {
        const copyOfItem = {...item}
        copyOfItem.id = crypto.randomUUID();
        copyOfItem.option = item.name;
        return copyOfItem
      })
      dispatch(setContinents(formattedContinents))
      dispatch(setContinentsLoaded(true))
    }).catch(err => {
      console.log("Failed to fetch continents")
      dispatch(setContinentsLoaded(true))
    })

  }, []);

  useEffect(() => {
    const processId = searchParams.get('id');
    const processState = searchParams.get('state');

    if (!processId || !processState) return
    
    if (processState !== 'draft') return

    const foundProcess = allProcesses.find(process => process._id === processId);
    if (!foundProcess) return

    // getSingleProcessV2(foundProcess._id).then(res => {
    //   console.log(res.data)
    // }).catch(err => {
    //   console.log(err.response ? err.response.data : err.message)
    // })

  }, [searchParams, allProcesses])

  return (
    <WorkflowLayout>
      <div
        style={{ position: "relative", display: "flex" }}
        className={`${styles.container} set-workflow-in-document-container `}
      >
        <h2 className={`${styles.title} h2-large `}>
          Set WorkFlows in Documents
        </h2>
        <SelectDoc />
        <ContentMapOfDoc />
        <div className={styles.diveder}></div>
        <SelectWorkflow />
        <div className={styles.diveder}></div>
        <ConnectWorkFlowToDoc />
        <div className={styles.diveder}></div>
        <CheckErrors />
        <div className={styles.diveder}></div>
        <ProcessDocument />
      </div>
    </WorkflowLayout>
  );
};

export default SetWorkflowInDoc;
