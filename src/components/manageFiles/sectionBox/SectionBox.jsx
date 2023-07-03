import styles from './sectionBox.module.css';
import maneFilesStyles from '../manageFiles.module.css';
import BookSpinner from '../../bookSpinner/BookSpinner';
import { useState } from 'react';

import { PrimaryButton } from '../../styledComponents/styledComponents';
import { IoIosRefresh } from 'react-icons/io';
import { LoadingSpinner } from '../../LoadingSpinner/LoadingSpinner';
import { useDispatch, useSelector } from 'react-redux';
import { DocumentServices } from '../../../services/documentServices';
import { toast } from 'react-toastify';
import { TemplateServices } from '../../../services/templateServices';
import { WorkflowServices } from '../../../services/workflowServices';
import { getAllProcessesV2 } from '../../../services/processServices';
import {
  setAllProcesses,
  setNotificationsForUser,
} from '../../../features/app/appSlice';
import { setAllDocuments } from '../../../features/document/documentSlice';
import { setAllTemplates } from '../../../features/template/templateSlice';
import { setAllWorkflows } from '../../../features/workflow/workflowsSlice';
import { useTranslation } from 'react-i18next';
import { productName } from '../../../utils/helpers';

const SectionBox = ({
  cardItems,
  title,
  Card,
  status,
  idKey,
  itemType,
  hideFavoriteIcon,
  hideDeleteIcon,
  folderId,
}) => {
  const [sliceCount, setSliceCount] = useState(1);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const { userDetail } = useSelector((state) => state.auth);
  const { processesLoading, notificationsForUser, notificationsLoading } =
    useSelector((state) => state.app);
  const { allDocumentsStatus } = useSelector((state) => state.document);
  const { allTemplatesStatus } = useSelector((state) => state.template);
  const { allWorkflowsStatus } = useSelector((state) => state.workflow);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [foldersLoading] = useState(false); //! THIS IS A DUMMY
  const [folderLoading] = useState(false); //! THIS IS A DUMMY

  // console.log('card Items: ', cardItems, title, card);

  const handleLoadMore = () => {
    setSliceCount((prev) => prev + 1);
  };

  const handleRefresh = () => {
    if (refreshLoading) return;

    const [currentUserCompanyId, currentUserportfolioDataType] = [
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info.find(
            (portfolio) => portfolio.product === productName
          )?.org_id
        : userDetail?.portfolio_info[0]?.org_id,
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info.find(
            (portfolio) => portfolio.product === productName
          )?.data_type
        : userDetail?.portfolio_info[0]?.data_type,
    ];

    if (itemType === 'documents') {
      setRefreshLoading(true);

      const data = {
        company_id: currentUserCompanyId,
        data_type: currentUserportfolioDataType,
      };

      const documentServices = new DocumentServices();

      documentServices
        .allDocuments(data.company_id, data.data_type)
        .then((res) => {
          dispatch(
            setAllDocuments(
              res.data.documents
                .reverse()
                .filter(
                  (document) =>
                    document.document_state !== 'trash' &&
                    document.data_type &&
                    document.data_type === currentUserportfolioDataType
                )
            )
          );
          toast.success('Successfully refreshed documents');
          setRefreshLoading(false);
        })
        .catch((err) => {
          // console.log(err, 'Refresh for documents failed');
          toast.info('Refresh for documents failed');
          setRefreshLoading(false);
        });
    }

    if (itemType === 'templates') {
      setRefreshLoading(true);

      const data = {
        company_id: currentUserCompanyId,
        data_type: currentUserportfolioDataType,
      };

      const templatesServices = new TemplateServices();

      templatesServices
        .allTemplates(data.company_id, data.data_type)
        .then((res) => {
          dispatch(
            setAllTemplates(
              res.data.templates
                .reverse()
                .filter(
                  (template) =>
                    template.data_type &&
                    template.data_type === currentUserportfolioDataType
                )
            )
          );
          toast.success('Successfully refreshed templates');
          setRefreshLoading(false);
        })
        .catch((err) => {
          // console.log(err, 'Refresh for templates failed');
          toast.info('Refresh for templates failed');
          setRefreshLoading(false);
        });
    }

    if (itemType === 'workflows') {
      setRefreshLoading(true);

      const data = {
        company_id: currentUserCompanyId,
        data_type: currentUserportfolioDataType,
      };

      const workflowServices = new WorkflowServices();

      workflowServices
        .allWorkflows(data.company_id, data.data_type)
        .then((res) => {
          dispatch(
            setAllWorkflows(
              res.data.workflows.filter(
                (workflow) =>
                  (workflow?.data_type &&
                    workflow?.data_type === currentUserportfolioDataType) ||
                  (workflow.workflows.data_type &&
                    workflow.workflows.data_type ===
                      currentUserportfolioDataType)
              )
            )
          );
          toast.success('Successfully refreshed workflows');
          setRefreshLoading(false);
        })
        .catch((err) => {
          // console.log(err, 'Refresh for workflows failed');
          toast.info('Refresh for workflows failed');
          setRefreshLoading(false);
        });
    }

    if (itemType === 'processes') {
      setRefreshLoading(true);

      const data = {
        company_id: currentUserCompanyId,
        data_type: currentUserportfolioDataType,
      };

      getAllProcessesV2(data.company_id, data.data_type)
        .then((res) => {
          const savedProcessesInLocalStorage = JSON.parse(
            localStorage.getItem('user-saved-processes')
          );
          if (savedProcessesInLocalStorage) {
            const processes = [
              ...savedProcessesInLocalStorage,
              ...res.data.filter((process) => process.processing_state),
            ].sort((a, b) => new Date(b?.created_at) - new Date(a?.created_at));
            dispatch(setAllProcesses(processes));
          } else {
            dispatch(
              setAllProcesses(
                res.data.filter((process) => process.processing_state).reverse()
              )
            );
          }
          toast.success('Successfully refreshed processes');
          setRefreshLoading(false);
        })
        .catch((err) => {
          // console.log(err, 'Refresh for processes failed');
          toast.info('Refresh for processes failed');
          setRefreshLoading(false);
        });
    }

    if (itemType === 'notifications') {
      setRefreshLoading(true);

      const documentService = new DocumentServices();

      documentService
        .allDocuments(currentUserCompanyId, currentUserportfolioDataType)
        .then((res) => {
          const documentsToSign = res.data.documents
            .reverse()
            .filter(
              (document) =>
                document.company_id === currentUserCompanyId &&
                document.data_type === currentUserportfolioDataType &&
                (document.state === 'processing' ||
                  document.document_state === 'processing') &&
                document.auth_viewers &&
                document.auth_viewers.includes(userDetail?.userinfo?.username)
            )
            .filter((document) => document.process_id);

          const currentNotifications = notificationsForUser.slice();
          let updatedNotifications = currentNotifications.map(
            (notification) => {
              const data = documentsToSign.map((dataObj) => {
                let copyOfDataObj = { ...dataObj };
                copyOfDataObj.type = 'sign-document';
                return copyOfDataObj;
              });
              const copyOfNotification = { ...notification };
              if (copyOfNotification.title === 'documents') {
                copyOfNotification.items = data;
                return copyOfNotification;
              }
              return notification;
            }
          );

          dispatch(setNotificationsForUser(updatedNotifications));
          toast.success('Successfully refreshed notifications');
          setRefreshLoading(false);
        })
        .catch((err) => {
          // console.log(err, 'Refresh for notifications failed');
          toast.info('Refresh for notifications failed');
          setRefreshLoading(false);
        });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content__container}>
        <div className={styles.content__box}>
          <h2
            className={maneFilesStyles.header}
            id={idKey ? title.replaceAll(' ', '') + '-' + idKey : ''}
          >
            {t(title)}
            {itemType ? (
              itemType === 'documents' ? (
                allDocumentsStatus !== 'pending' ? (
                  <button
                    className={styles.refresh__btn}
                    onClick={handleRefresh}
                  >
                    {refreshLoading ? (
                      <LoadingSpinner
                        color={'white'}
                        width={'1rem'}
                        height={'1rem'}
                      />
                    ) : (
                      <IoIosRefresh />
                    )}
                    <span>{t('Refresh')}</span>
                  </button>
                ) : (
                  <></>
                )
              ) : itemType === 'templates' ? (
                allTemplatesStatus !== 'pending' ? (
                  <button
                    className={styles.refresh__btn}
                    onClick={handleRefresh}
                  >
                    {refreshLoading ? (
                      <LoadingSpinner
                        color={'white'}
                        width={'1rem'}
                        height={'1rem'}
                      />
                    ) : (
                      <IoIosRefresh />
                    )}
                    <span>Refresh</span>
                  </button>
                ) : (
                  <></>
                )
              ) : itemType === 'workflows' ? (
                allWorkflowsStatus !== 'pending' ? (
                  <button
                    className={styles.refresh__btn}
                    onClick={handleRefresh}
                  >
                    {refreshLoading ? (
                      <LoadingSpinner
                        color={'white'}
                        width={'1rem'}
                        height={'1rem'}
                      />
                    ) : (
                      <IoIosRefresh />
                    )}
                    <span>{t('Refresh')}</span>
                  </button>
                ) : (
                  <></>
                )
              ) : itemType === 'processes' ? (
                !processesLoading ? (
                  <button
                    className={styles.refresh__btn}
                    onClick={handleRefresh}
                  >
                    {refreshLoading ? (
                      <LoadingSpinner
                        color={'white'}
                        width={'1rem'}
                        height={'1rem'}
                      />
                    ) : (
                      <IoIosRefresh />
                    )}
                    <span>Refresh</span>
                  </button>
                ) : (
                  <></>
                )
              ) : itemType === 'notifications' ? (
                !notificationsLoading ? (
                  <button
                    className={styles.refresh__btn}
                    onClick={handleRefresh}
                  >
                    {refreshLoading ? (
                      <LoadingSpinner
                        color={'white'}
                        width={'1rem'}
                        height={'1rem'}
                      />
                    ) : (
                      <IoIosRefresh />
                    )}
                    <span>{t('Refresh')}</span>
                  </button>
                ) : (
                  <></>
                )
              ) : itemType === 'folders' ? (
                // !foldersLoading ? (
                //   <button
                //     className={styles.refresh__btn}
                //     // onClick={handleRefresh}
                //   >
                //     {refreshLoading ? (
                //       <LoadingSpinner
                //         color={'white'}
                //         width={'1rem'}
                //         height={'1rem'}
                //       />
                //     ) : (
                //       <IoIosRefresh />
                //     )}
                //     <span>{t('Refresh')}</span>
                //   </button>
                // ) : (
                //   <></>
                // )
                ''
              ) : itemType === 'folder' ? (
                // !folderLoading ? (
                //   <button
                //     className={styles.refresh__btn}
                //     // onClick={handleRefresh}
                //   >
                //     {refreshLoading ? (
                //       <LoadingSpinner
                //         color={'white'}
                //         width={'1rem'}
                //         height={'1rem'}
                //       />
                //     ) : (
                //       <IoIosRefresh />
                //     )}
                //     <span>{t('Refresh')}</span>
                //   </button>
                // ) : (
                //   <></>
                // )
                ''
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
          </h2>

          {status === 'pending' ? (
            <div style={{ marginTop: '15px' }}>
              <BookSpinner />
            </div>
          ) : (
            Card &&
            cardItems &&
            cardItems.length && (
              <>
                <div className={styles.grid__box}>
                  {Card &&
                    cardItems &&
                    cardItems.length > 0 &&
                    cardItems
                      .slice(0, sliceCount * 10)
                      .map((item) => (
                        <Card
                          key={item._id}
                          cardItem={item}
                          hideFavoriteIcon={hideFavoriteIcon}
                          hideDeleteIcon={hideDeleteIcon}
                          isFolder={itemType === 'folder' ? true : false}
                          folderId={folderId}
                        />
                      ))}
                </div>
                {cardItems && cardItems.length > 10 && (
                  <PrimaryButton
                    style={{
                      pointerEvents: `${
                        cardItems.length / 10 < sliceCount && 'none'
                      }`,
                    }}
                    hoverBg='success'
                    onClick={handleLoadMore}
                  >
                    {cardItems.length / 10 < sliceCount
                      ? 'no more load'
                      : 'load more'}
                  </PrimaryButton>
                )}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionBox;
