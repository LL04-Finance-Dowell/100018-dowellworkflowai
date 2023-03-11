import { useDispatch, useSelector } from "react-redux";
import SideBar from "../../components/newSidebar/Sidebar";
import "./style.css";
import styles from "./workflowLayout.module.css";
import Editor from "../../components/editor/Editor";
import { useEffect, useState } from "react";
import DowellLogo from "../../assets/dowell.png";
import Spinner from "../../components/spinner/Spinner";
import useCloseElementOnEscapekeyClick from "../../../src/hooks/useCloseElementOnEscapeKeyClick";
import UserDetail from "../../components/newSidebar/userDetail/UserDetail";
import { setLegalAgreePageLoading, setShowLegalStatusPopup, setUserDetailPosition } from "../../features/app/appSlice";
import { AiOutlineClose } from "react-icons/ai";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { formatDateAndTime } from "../../utils/helpers";
import { workflowRegistrationEventId } from "../../services/legalService";

const WorkflowLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { userDetail, session_id, id } = useSelector((state) => state.auth);
  const { 
    userDetailPosition,
    legalStatusLoading,
    showLegalStatusPopup,
    legalTermsAgreed,
    dateAgreedToLegalStatus,
    legalArgeePageLoading,
  } = useSelector((state) => state.app);
  const [createNewPortfolioLoading, setCreateNewPortfolioLoading] =
    useState(false);

  const handleClick = () => {
    if (session_id) {
      setCreateNewPortfolioLoading(true);
      sessionStorage.clear();
      window.location.replace(
        `https://100093.pythonanywhere.com/?session_id=${session_id}`
      );
    }
  };

  useCloseElementOnEscapekeyClick(() => setCreateNewPortfolioLoading(false));

  const handleMouseEnter = () => {
    dispatch(setUserDetailPosition(userDetailPosition));
  };

  const handleMouseLeave = () => {
    dispatch(setUserDetailPosition(null));
  };
  
  const handleAgreeCheckBoxClick = (e) => {
    e.preventDefault();
    dispatch(setLegalAgreePageLoading(true))
    window.location = `https://100087.pythonanywhere.com/legalpolicies/${workflowRegistrationEventId}/website-privacy-policy/policies/?redirect_url=${window.location.origin}/workflowai.online/%23?id=${id}&session_id=${session_id}`;
  };
  
  return (
    <>
      <div className={styles.container}>
        {userDetail ? (
          !userDetail.portfolio_info ||
          userDetail.portfolio_info?.length === 0 ||
          (userDetail.portfolio_info?.length > 0 && !userDetail.portfolio_info.find(item => item.product === "Workflow AI")) ? (
            <div className={styles.redirect__container}>
              <div className={styles.img__container}>
                <img src={DowellLogo} />
              </div>
              <div className={styles.typewriter}>
                <h1>
                  You don't have portfolio,{" "}
                  <span onClick={handleClick}> create here</span>
                </h1>
              </div>
              {createNewPortfolioLoading ? (
                <div className="loading__Spinner__New__Portfolio">
                  <Spinner />
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <>
              <div className={styles.content__box}>
                <div className={`${styles.sidebar__box} hide-scrollbar`}>
                  <SideBar />
                </div>
                <div className={styles.children__box}>
                  {children}
                </div>
              </div>
              <Editor />
            </>
          )
        ) : (
          <div style={{ margin: "auto" }}>
            <Spinner />
          </div>
        )}
        {userDetailPosition && (
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              position: "fixed",
              zIndex: "10000000",
              top: `${userDetailPosition.top}px`,
              left: `${userDetailPosition.left}px`,
            }}
          >
            <UserDetail />
          </div>
        )}
        {showLegalStatusPopup && (
          <div className={styles.legal__Overlay__Container}>
            <div className={styles.legal__Content__Container}>
              <div
                className={styles.legal__Overlay__Container__Close__Icon}
                onClick={() => dispatch(setShowLegalStatusPopup(false))}
              >
                <AiOutlineClose />
              </div>
              <h3>Agree to terms</h3>
              {legalStatusLoading ? (
                <LoadingSpinner />
              ) : (
                <div className={styles.legal__Content__Form__Container}>
                  {dateAgreedToLegalStatus && dateAgreedToLegalStatus.length > 1 && (
                    <span className={styles.date__Agreed}>
                      You agreed on: {formatDateAndTime(dateAgreedToLegalStatus)}
                    </span>
                  )}
                  <label className={styles.legal__Agree}>
                    <input
                      checked={legalTermsAgreed}
                      type="checkbox"
                      onChange={handleAgreeCheckBoxClick}
                    />
                    I agree with the privacy policy and terms and conditions
                  </label>
                  <button
                    disabled={!legalTermsAgreed}
                    className={`${styles.legal__Register__Btn} ${styles.continue__Btn}`}
                    onClick={() => dispatch(setShowLegalStatusPopup(false))}
                  >
                    {"Continue"}
                  </button>
                  {legalArgeePageLoading ? (
                    <div className="loading__Spinner__New__Portfolio abs__Pos">
                      <Spinner />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WorkflowLayout;
