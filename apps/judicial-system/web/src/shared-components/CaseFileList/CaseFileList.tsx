import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { Box, Text, UploadedFile, UploadFile } from '@island.is/island-ui/core'
import {
  CaseFile as TCaseFile,
  CaseFileState,
} from '@island.is/judicial-system/types'
import { Modal } from '..'
import { useFileList } from '../../utils/hooks'

interface Props {
  caseId: string
  files: TCaseFile[]
  hideIcons?: boolean
  canOpenFiles?: boolean
  handleRetryClick?: (id: string) => void
}

const CaseFileList: React.FC<Props> = (props) => {
  const {
    caseId,
    files,
    hideIcons = true,
    canOpenFiles = true,
    handleRetryClick,
  } = props

  const { handleOpenFile, fileNotFound, dismissFileNotFound } = useFileList({
    caseId,
  })
  return files.length > 0 ? (
    <>
      {files.map((file, index) => {
        return (
          <Box marginBottom={index !== files.length - 1 ? 3 : 0} key={index}>
            <UploadedFile
              file={file}
              showFileSize={true}
              defaultBackgroundColor="blue100"
              doneIcon="checkmark"
              hideIcons={
                hideIcons ||
                [
                  CaseFileState.BOKEN_LINK,
                  CaseFileState.STORED_IN_RVG,
                ].includes(file.state)
              }
              onOpenFile={
                canOpenFiles
                  ? (file: UploadFile) => {
                      if (file.id) {
                        handleOpenFile(file.id)
                      }
                    }
                  : undefined
              }
              onRemoveClick={() =>
                canOpenFiles ? handleOpenFile(file.id) : null
              }
              onRetryClick={() => handleRetryClick && handleRetryClick(file.id)}
            />
          </Box>
        )
      })}
      <AnimatePresence>
        {fileNotFound && (
          <Modal
            title="Skjalið er ekki lengur aðgengilegt í Réttarvörslugátt"
            text="Rannsóknargögnum er eytt sjálfkrafa að loknum kærufresti."
            handleClose={() => dismissFileNotFound()}
            handlePrimaryButtonClick={() => dismissFileNotFound()}
            primaryButtonText="Loka glugga"
          />
        )}
      </AnimatePresence>
    </>
  ) : (
    <Text>Engin rannsóknargögn fylgja kröfunni í Réttarvörslugátt.</Text>
  )
}

export default CaseFileList
