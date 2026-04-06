import { OhosAppTask } from '../task/ohos-app-task.js';
import { FileSet, Project, TaskInputValue } from '@ohos/hvigor';
import { ProjectTaskService } from '../service/project-task-service.js';
export declare class ProcessProjectPrivacyProfile extends OhosAppTask {
    private outputPath;
    private appPacJson;
    constructor(project: Project, taskService: ProjectTaskService);
    declareInputs(): Map<string, TaskInputValue>;
    declareInputFiles(): FileSet;
    declareOutputFiles(): FileSet;
    protected initTaskDepends(): void;
    protected doTaskAction(): void;
    private processValidPacFiles;
}
