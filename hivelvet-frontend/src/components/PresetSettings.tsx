/**
 * Hivelvet open source platform - https://riadvice.tn/
 *
 * Copyright (c) 2022 RIADVICE SUARL and by respective authors (see below).
 *
 * This program is free software; you can redistribute it and/or modify it under the
 * terms of the GNU Lesser General Public License as published by the Free Software
 * Foundation; either version 3.0 of the License, or (at your option) any later
 * version.
 *
 * Hivelvet is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 * PARTICULAR PURPOSE. See the GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License along
 * with Hivelvet; if not, see <http://www.gnu.org/licenses/>.
 */

import React, { useEffect, useState } from 'react';

import PresetSettingsService from '../services/preset.settings.service';

import { Col, Form, Row, Spin } from 'antd';
import { withTranslation } from 'react-i18next';

import { Step3Form } from './Step3Form';

import Notifications from './Notifications';
import { t } from 'i18next';
import { PresetType } from '../types/PresetType';
import { SubCategoryType } from '../types/SubCategoryType';

const PresetSettings = () => {
    const [presets, setPresets] = React.useState<PresetType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        PresetSettingsService.collect_preset_settings()
            .then((response) => {
                const presetsData: PresetType[] = response.data;
                if (presetsData) {
                    setPresets(presetsData);
                    setIsLoading(false);
                }
            })
            .catch((error) => {
                setIsLoading(false);
                console.log(error);
            });
    }, []);

    const onFinish = (category: string, subCategories: SubCategoryType[]) => {
        PresetSettingsService.edit_preset_settings(category, subCategories)
            .then((response) => {
                const newPresetData: PresetType = response.data.settings;
                const newData = [...presets];
                const index = newData.findIndex((item) => category === item.name);
                if (index > -1 && newPresetData != undefined) {
                    const item = newData[index];
                    newData.splice(index, 1, {
                        ...item,
                        ...newPresetData,
                    });
                    setPresets(newData);
                    Notifications.openNotificationWithIcon('success', t('edit_preset_settings_success'));
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <Row justify="center" className="preset-settings-row">
            {isLoading ? (
                <Spin size="large" />
            ) : (
                <Col span={20}>
                    <Form className="install-form">
                        <Step3Form presets={presets} onFinish={onFinish} />
                    </Form>
                </Col>
            )}
        </Row>
    );
};

export default withTranslation()(PresetSettings);